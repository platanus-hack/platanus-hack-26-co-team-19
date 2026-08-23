"""LiteParse Python library integration for PDF OCR."""

from __future__ import annotations

import os
from pathlib import Path


def extract_pdf_text(
    pdf_path: Path,
    *,
    language: str,
    max_pages: int = 2,
) -> str:
    """Parse a PDF with LiteParse and return non-empty plain text."""
    from liteparse import LiteParse

    parser = LiteParse(
        output_format="text",
        ocr_enabled=True,
        ocr_language=language,
        max_pages=max_pages,
        tessdata_path=os.environ.get("TESSDATA_PREFIX", "/opt/tessdata"),
    )

    result = parser.parse(str(pdf_path))

    text = result.text.strip() if result.text else ""
    if not text:
        raise RuntimeError("LiteParse returned no text")
    return text
