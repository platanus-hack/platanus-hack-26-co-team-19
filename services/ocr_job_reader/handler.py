"""Discover up to 40 incomplete OCR jobs from PostgreSQL."""

from __future__ import annotations

import json
import os
from typing import Any

import boto3
import psycopg
from psycopg.rows import dict_row

MAX_BATCH_SIZE = 10
INCOMPLETE_STATUS = "INCOMPLETE"
REQUIRED_POSTGRES_SETTINGS = (
    "POSTGRES_HOST",
    "POSTGRES_PORT",
    "POSTGRES_DB",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_SSLMODE",
)

PENDING_PROVIDENCIAS_QUERY = """
SELECT
    id,
    s3_key
FROM corte.providencias
WHERE status = %s
   OR status IS NULL
   OR BTRIM(status) = ''
ORDER BY id
LIMIT %s
"""


def handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    """Fetch incomplete providencias and return only the id/s3_key Map contract."""
    del event, context

    secret_arn = os.environ.get("POSTGRES_SECRET_ARN")
    if not secret_arn:
        raise RuntimeError("POSTGRES_SECRET_ARN is required")

    secret_response = boto3.client("secretsmanager").get_secret_value(
        SecretId=secret_arn
    )
    secret_string = secret_response.get("SecretString")
    if not secret_string:
        raise RuntimeError("PostgreSQL secret has no SecretString value")

    try:
        postgres = json.loads(secret_string)
    except json.JSONDecodeError as error:
        raise RuntimeError("PostgreSQL secret is not valid JSON") from error

    missing_settings = [
        name for name in REQUIRED_POSTGRES_SETTINGS if not postgres.get(name)
    ]
    if missing_settings:
        raise RuntimeError(
            "PostgreSQL secret is missing required settings: "
            + ", ".join(missing_settings)
        )

    with psycopg.connect(
        host=postgres["POSTGRES_HOST"],
        port=postgres["POSTGRES_PORT"],
        dbname=postgres["POSTGRES_DB"],
        user=postgres["POSTGRES_USER"],
        password=postgres["POSTGRES_PASSWORD"],
        sslmode=postgres["POSTGRES_SSLMODE"],
        connect_timeout=10,
    ) as connection:
        with connection.cursor(row_factory=dict_row) as cursor:
            cursor.execute(
                PENDING_PROVIDENCIAS_QUERY,
                (INCOMPLETE_STATUS, MAX_BATCH_SIZE),
            )
            providencias = cursor.fetchall()

    items: list[dict[str, str]] = []
    skipped_missing_identity = 0
    for providencia in providencias:
        providencia_id = providencia.get("id")
        s3_key = providencia.get("s3_key")
        if providencia_id is None or s3_key is None:
            skipped_missing_identity += 1
            continue

        items.append(
            {
                "id": str(providencia_id),
                "s3_key": str(s3_key),
            }
        )

    return {
        "items": items,
        "summary": {
            "selected": len(items),
            "limit": MAX_BATCH_SIZE,
            "skipped_missing_id_or_s3_key": skipped_missing_identity,
        },
    }
