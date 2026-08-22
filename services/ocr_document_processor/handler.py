"""Placeholder Lambda for processing one OCR document job."""

from __future__ import annotations

from typing import Any


def handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    """Return a placeholder result until OCR and DeepSeek processing are implemented."""
    del context

    job = event.get("job", {})
    return {
        "job_id": job.get("id"),
        "status": "NOT_IMPLEMENTED",
    }
