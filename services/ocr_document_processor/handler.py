"""Placeholder Lambda for processing one OCR document job."""

from __future__ import annotations

from typing import Any


def handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    """Return the id/path contract received from the OCR Step Functions Map."""
    del context

    job = event.get("job", {})
    return {
        "job_id": job.get("id"),
        "path": job.get("path"),
        "status": "NOT_IMPLEMENTED",
    }
