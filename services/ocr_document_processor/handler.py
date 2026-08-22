"""Process one legal PDF through S3, LiteParse OCR, DeepSeek, and PostgreSQL."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from schemas.providencia_extraction import ProvidenciaExtraction
from services.deepseek_service import DeepSeekService
from services.ocr_service import extract_pdf_text
from services.postgres_service import update_providencia
from services.s3_service import download_pdf
from services.secrets_service import get_json_secret


def handler(event: dict[str, Any], context: Any) -> dict[str, str]:
    """Extract and persist structured data for the Step Functions Map item."""
    del context

    job = event.get("job")
    if not isinstance(job, dict):
        raise ValueError("Map input must contain a job object")

    providencia_id = job.get("id")
    s3_key = job.get("s3_key")
    if providencia_id is None or not isinstance(s3_key, str) or not s3_key.strip():
        raise ValueError("Map job requires non-empty id and s3_key")

    bucket_name = os.environ.get("LEGAL_DOCUMENTS_BUCKET")
    postgres_secret_arn = os.environ.get("POSTGRES_SECRET_ARN")
    deepseek_secret_arn = os.environ.get("DEEPSEEK_SECRET_ARN")
    if not bucket_name or not postgres_secret_arn or not deepseek_secret_arn:
        raise RuntimeError(
            "LEGAL_DOCUMENTS_BUCKET, POSTGRES_SECRET_ARN, and DEEPSEEK_SECRET_ARN are required"
        )

    postgres_settings = get_json_secret(postgres_secret_arn)
    deepseek_settings = get_json_secret(deepseek_secret_arn)
    deepseek_api_key = deepseek_settings.get("DEEPSEEK_API_KEY")
    if not isinstance(deepseek_api_key, str) or not deepseek_api_key:
        raise RuntimeError("DeepSeek secret is missing DEEPSEEK_API_KEY")

    pdf_path: Path | None = None
    try:
        pdf_path = download_pdf(bucket_name, s3_key)
        ocr_text = extract_pdf_text(
            pdf_path,
            language=os.environ.get("OCR_LANGUAGE", "spa"),
        )
        llm_output = DeepSeekService(
            api_key=deepseek_api_key,
            model=os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-flash"),
        ).extract_providencia(ocr_text)
        extraction = ProvidenciaExtraction.model_validate(llm_output)

        completed_status = os.environ.get("PROVIDENCIA_COMPLETE_STATUS", "COMPLETE")
        update_providencia(
            postgres_settings=postgres_settings,
            providencia_id=str(providencia_id),
            ponente=extraction.ponente,
            completed_status=completed_status,
        )
    finally:
        if pdf_path is not None:
            pdf_path.unlink(missing_ok=True)

    return {
        "id": str(providencia_id),
        "s3_key": s3_key,
        "status": completed_status,
        "ponente": extraction.ponente,
    }
