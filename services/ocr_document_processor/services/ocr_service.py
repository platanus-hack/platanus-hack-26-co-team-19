"""LiteParse CLI integration for PDF OCR."""

from __future__ import annotations

import subprocess
from pathlib import Path


def extract_pdf_text(
    pdf_path: Path,
    *,
    language: str,
    dpi: int = 300,
    timeout_seconds: int = 240,
) -> str:
    """Run LiteParse OCR and return non-empty text for a temporary PDF."""
    command = [
        "lit",
        "parse",
        str(pdf_path),
        "--format",
        "text",
        "--ocr-language",
        language,
        "--dpi",
        str(dpi),
        "--quiet",
    ]

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            check=False,
            text=True,
            timeout=timeout_seconds,
        )
    except subprocess.TimeoutExpired as error:
        raise RuntimeError("LiteParse OCR timed out") from error

    if result.returncode != 0:
        raise RuntimeError("LiteParse OCR failed")

    text = result.stdout.strip()
    if not text:
        raise RuntimeError("LiteParse OCR returned no text")
    return text
