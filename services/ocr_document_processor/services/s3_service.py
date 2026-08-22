"""Private S3 download utilities for legal PDF documents."""

from __future__ import annotations

import os
import tempfile
from pathlib import Path


def download_pdf(bucket_name: str, s3_key: str) -> Path:
    """Download one S3 object to /tmp and return its temporary PDF path."""
    import boto3

    file_descriptor, temporary_name = tempfile.mkstemp(suffix=".pdf", dir="/tmp")
    os.close(file_descriptor)
    temporary_path = Path(temporary_name)

    try:
        boto3.client("s3").download_file(bucket_name, s3_key, str(temporary_path))
    except Exception:
        temporary_path.unlink(missing_ok=True)
        raise

    return temporary_path
