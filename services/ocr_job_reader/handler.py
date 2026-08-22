"""Placeholder Lambda for discovering pending OCR jobs."""

from __future__ import annotations

from typing import Any


def handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    """Return an empty OCR work batch until PostgreSQL discovery is implemented."""
    del event, context

    return {
        "items": [],
        "summary": {
            "pending": 0,
            "completed": 0,
        },
    }
