"""Read judges from providencias, compare against jueces_perfiles, return work list."""

from __future__ import annotations

import json
import os
from typing import Any

import boto3
import psycopg
from psycopg.rows import dict_row

MAX_BATCH_SIZE = 20

REQUIRED_POSTGRES_SETTINGS = (
    "POSTGRES_HOST",
    "POSTGRES_PORT",
    "POSTGRES_DB",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_SSLMODE",
)

# All judges with their case count and key metadata from providencias
JUDGES_QUERY = """
SELECT
    ponente,
    sala,
    seccion,
    subseccion,
    COUNT(*)                                                        AS total_casos,
    COUNT(*) FILTER (WHERE favorecido = 'ciudadano')               AS casos_ciudadano,
    COUNT(*) FILTER (WHERE favorecido = 'estado')                  AS casos_estado,
    COUNT(*) FILTER (WHERE favorecido = 'mixto')                   AS casos_mixto,
    COUNT(*) FILTER (WHERE favorecido = 'indeterminado')           AS casos_indeterminado,
    ROUND(AVG(citas_jurisprudencia) FILTER (
        WHERE citas_jurisprudencia IS NOT NULL
    ), 2)                                                           AS citas_promedio,
    ARRAY_AGG(DISTINCT clase_proceso ORDER BY clase_proceso)       AS tipos_proceso
FROM corte.providencias
WHERE ponente IS NOT NULL
  AND BTRIM(ponente) <> ''
  AND status = 'COMPLETE'
GROUP BY ponente, sala, seccion, subseccion
ORDER BY total_casos DESC
LIMIT %s
"""

# Existing profiles with their case count
EXISTING_PROFILES_QUERY = """
SELECT ponente, total_casos, resumen
FROM corte.jueces_perfiles
"""


def handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    """Compare judge case counts against stored profiles and return work list."""
    del event, context

    secret_arn = os.environ.get("POSTGRES_SECRET_ARN")
    if not secret_arn:
        raise RuntimeError("POSTGRES_SECRET_ARN is required")

    secret_response = boto3.client("secretsmanager").get_secret_value(
        SecretId=secret_arn
    )
    secret_string = secret_response.get("SecretString")
    if not isinstance(secret_string, str) or not secret_string:
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
            cursor.execute(JUDGES_QUERY, (MAX_BATCH_SIZE,))
            judges = cursor.fetchall()

            cursor.execute(EXISTING_PROFILES_QUERY)
            existing_profiles = {
                row["ponente"]: row for row in cursor.fetchall()
            }

    items: list[dict[str, Any]] = []
    skipped = 0

    for judge in judges:
        ponente = judge.get("ponente")
        if not ponente:
            skipped += 1
            continue

        total_casos = int(judge.get("total_casos") or 0)
        existing = existing_profiles.get(ponente)

        if existing is None:
            # New judge — build full profile
            action = "create"
            previous_resumen = None
            previous_total_casos = 0
        elif total_casos > int(existing.get("total_casos") or 0):
            # More cases than last profile — update
            action = "update"
            previous_resumen = existing.get("resumen")
            previous_total_casos = int(existing.get("total_casos") or 0)
        else:
            # Same case count — skip
            skipped += 1
            continue

        # Limit tipos_proceso to top 3
        tipos_proceso = (judge.get("tipos_proceso") or [])[:3]

        items.append({
            "ponente": ponente,
            "sala": judge.get("sala"),
            "seccion": judge.get("seccion"),
            "subseccion": judge.get("subseccion"),
            "total_casos": total_casos,
            "casos_ciudadano": int(judge.get("casos_ciudadano") or 0),
            "casos_estado": int(judge.get("casos_estado") or 0),
            "casos_mixto": int(judge.get("casos_mixto") or 0),
            "casos_indeterminado": int(judge.get("casos_indeterminado") or 0),
            "citas_promedio": float(judge.get("citas_promedio") or 0),
            "tipos_proceso": tipos_proceso,
            "action": action,
            "previous_resumen": previous_resumen,
            "previous_total_casos": previous_total_casos,
        })

    return {
        "items": items,
        "summary": {
            "to_process": len(items),
            "skipped": skipped,
            "limit": MAX_BATCH_SIZE,
        },
    }
