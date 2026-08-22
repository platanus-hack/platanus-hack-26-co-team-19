
#!/usr/bin/env python3
"""Print a local LiteParse OCR extraction for the supplied PDF."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from liteparse import LiteParse

DEFAULT_DOCUMENT = Path(__file__).with_name(
    "Autoqueresuel Extractor 2026-07-23.pdf"
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract and print PDF text with LiteParse OCR."
    )
    parser.add_argument(
        "document",
        nargs="?",
        type=Path,
        default=DEFAULT_DOCUMENT,
        help=f"PDF to parse (default: {DEFAULT_DOCUMENT.name})",
    )
    parser.add_argument(
        "--language",
        default="spa",
        help="Tesseract OCR language in ISO 639-3 format (default: spa)",
    )
    parser.add_argument(
        "--dpi",
        type=int,
        default=300,
        help="Rasterization resolution for OCR (default: 300)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    document = args.document.expanduser().resolve()

    if not document.is_file():
        print(f"PDF not found: {document}", file=sys.stderr)
        return 2

    try:
        parser = LiteParse(
            ocr_enabled=True,
            ocr_language=args.language,
            dpi=args.dpi,
        )
        result = parser.parse(str(document))
    except Exception as error:
        print(f"LiteParse could not extract {document.name}: {error}", file=sys.stderr)
        return 1

    print(result.text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
