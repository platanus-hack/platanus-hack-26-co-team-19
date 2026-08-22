"""Local contract tests for the OCR document processor."""

from __future__ import annotations

import os
import sys
import tempfile
import types
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from pydantic import ValidationError

SERVICE_ROOT = Path(__file__).resolve().parents[1]
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

import handler as processor_handler
from schemas.providencia_extraction import ProvidenciaExtraction
from services import postgres_service
from structured_output import SYSTEM_PROMPT

VALID_ANALYSIS = {
    "favorecido": "ciudadano",
    "argumentos_clave": [
        "La autoridad desconoció una prueba decisiva para resolver la solicitud.",
        "El precedente aplicable exigía una motivación que la decisión impugnada no ofreció.",
    ],
    "citas_jurisprudencia": 2,
    "tono": "garantista",
    "observacion": "La Sala prioriza de manera expresa la protección material del derecho sobre las formalidades del trámite.",
}
POSTGRES_SETTINGS = {
    "POSTGRES_HOST": "db.example.test",
    "POSTGRES_PORT": "5432",
    "POSTGRES_DB": "legal",
    "POSTGRES_USER": "processor",
    "POSTGRES_PASSWORD": "not-a-real-password",
    "POSTGRES_SSLMODE": "require",
}


class ProvidenciaExtractionContractTests(unittest.TestCase):
    def test_schema_accepts_requested_analysis(self) -> None:
        extraction = ProvidenciaExtraction.model_validate(VALID_ANALYSIS)

        self.assertEqual(extraction.model_dump(), VALID_ANALYSIS)

    def test_schema_rejects_old_field_and_more_than_three_arguments(self) -> None:
        with_old_field = {**VALID_ANALYSIS, "ponente": "No debe aceptarse"}
        with self.assertRaises(ValidationError):
            ProvidenciaExtraction.model_validate(with_old_field)

        with_too_many_arguments = {
            **VALID_ANALYSIS,
            "argumentos_clave": ["Uno.", "Dos.", "Tres.", "Cuatro."],
        }
        with self.assertRaises(ValidationError):
            ProvidenciaExtraction.model_validate(with_too_many_arguments)

    def test_prompt_defines_only_the_requested_output_contract(self) -> None:
        for field in (
            "favorecido",
            "argumentos_clave",
            "citas_jurisprudencia",
            "tono",
            "observacion",
        ):
            self.assertIn(f'`{field}`', SYSTEM_PROMPT)
        self.assertIn("no incluyas nombre", SYSTEM_PROMPT)
        self.assertIn("ponente", SYSTEM_PROMPT)
        self.assertIn('"favorecido": "ciudadano"', SYSTEM_PROMPT)


class PersistenceAndHandlerContractTests(unittest.TestCase):
    def test_postgres_only_updates_completion_status(self) -> None:
        recorded: dict[str, object] = {}

        class FakeCursor:
            rowcount = 1

            def __enter__(self) -> "FakeCursor":
                return self

            def __exit__(self, *args: object) -> None:
                return None

            def execute(self, query: str, parameters: tuple[str, str]) -> None:
                recorded["query"] = query
                recorded["parameters"] = parameters

        class FakeConnection:
            def __enter__(self) -> "FakeConnection":
                return self

            def __exit__(self, *args: object) -> None:
                return None

            def cursor(self) -> FakeCursor:
                return FakeCursor()

        def fake_connect(**kwargs: object) -> FakeConnection:
            recorded["connection"] = kwargs
            return FakeConnection()

        fake_psycopg = types.SimpleNamespace(connect=fake_connect)
        with patch.dict(sys.modules, {"psycopg": fake_psycopg}):
            postgres_service.update_providencia(
                postgres_settings=POSTGRES_SETTINGS,
                providencia_id="providencia-123",
                completed_status="COMPLETE",
            )

        query = str(recorded["query"])
        self.assertIn("SET status = %s", query)
        self.assertNotIn("ponente", query.lower())
        self.assertEqual(recorded["parameters"], ("COMPLETE", "providencia-123"))

    def test_handler_returns_validated_analysis_and_marks_status(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            pdf_path = Path(temporary_directory) / "providencia.pdf"
            pdf_path.write_bytes(b"%PDF-1.4")
            fake_deepseek = Mock()
            fake_deepseek.extract_providencia.return_value = VALID_ANALYSIS

            with (
                patch.dict(
                    os.environ,
                    {
                        "LEGAL_DOCUMENTS_BUCKET": "legal-documents",
                        "POSTGRES_SECRET_ARN": "postgres-secret",
                        "DEEPSEEK_SECRET_ARN": "deepseek-secret",
                        "PROVIDENCIA_COMPLETE_STATUS": "COMPLETE",
                    },
                    clear=False,
                ),
                patch.object(
                    processor_handler,
                    "get_json_secret",
                    side_effect=[POSTGRES_SETTINGS, {"DEEPSEEK_API_KEY": "test-key"}],
                ),
                patch.object(processor_handler, "download_pdf", return_value=pdf_path),
                patch.object(processor_handler, "extract_pdf_text", return_value="texto OCR"),
                patch.object(processor_handler, "DeepSeekService", return_value=fake_deepseek),
                patch.object(processor_handler, "update_providencia") as update_providencia,
            ):
                result = processor_handler.handler(
                    {"job": {"id": "providencia-123", "s3_key": "source/document.pdf"}},
                    None,
                )

        self.assertEqual(
            result,
            {
                "id": "providencia-123",
                "s3_key": "source/document.pdf",
                "status": "COMPLETE",
                "analysis": VALID_ANALYSIS,
            },
        )
        self.assertFalse(pdf_path.exists())
        update_providencia.assert_called_once_with(
            postgres_settings=POSTGRES_SETTINGS,
            providencia_id="providencia-123",
            completed_status="COMPLETE",
        )


if __name__ == "__main__":
    unittest.main()
