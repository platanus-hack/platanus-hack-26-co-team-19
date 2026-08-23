"""PostgreSQL completion persistence for structured OCR results."""

from __future__ import annotations

import json
from typing import Any

REQUIRED_POSTGRES_SETTINGS = (
    "POSTGRES_HOST",
    "POSTGRES_PORT",
    "POSTGRES_DB",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_SSLMODE",
)


def update_providencia(
    *,
    postgres_settings: dict[str, Any],
    providencia_id: str,
    completed_status: str,
    analysis: dict[str, Any],
) -> None:
    """Mark the source row completed and persist the LLM analysis fields."""
    import psycopg

    missing_settings = [
        name for name in REQUIRED_POSTGRES_SETTINGS if not postgres_settings.get(name)
    ]
    if missing_settings:
        raise RuntimeError(
            "PostgreSQL secret is missing required settings: "
            + ", ".join(missing_settings)
        )

    # argumentos_clave is a list → store as JSON string in TEXT column
    argumentos_clave = analysis.get("argumentos_clave", [])
    argumentos_clave_json = json.dumps(argumentos_clave, ensure_ascii=False)

    with psycopg.connect(
        host=postgres_settings["POSTGRES_HOST"],
        port=postgres_settings["POSTGRES_PORT"],
        dbname=postgres_settings["POSTGRES_DB"],
        user=postgres_settings["POSTGRES_USER"],
        password=postgres_settings["POSTGRES_PASSWORD"],
        sslmode=postgres_settings["POSTGRES_SSLMODE"],
        connect_timeout=10,
    ) as connection:
        with connection.cursor() as cursor:
            print(f"[postgres] updating providencia id={providencia_id!r}")
            cursor.execute(
                """
                UPDATE corte.providencias
                SET
                    status                = %s,
                    favorecido            = %s,
                    argumentos_clave      = %s,
                    citas_jurisprudencia  = %s,
                    tono                  = %s,
                    observacion           = %s
                WHERE id = %s
                """,
                (
                    completed_status,
                    analysis.get("favorecido"),
                    argumentos_clave_json,
                    analysis.get("citas_jurisprudencia"),
                    analysis.get("tono"),
                    analysis.get("observacion"),
                    providencia_id,
                ),
            )
            print(f"[postgres] rowcount={cursor.rowcount}")
            if cursor.rowcount != 1:
                raise LookupError(
                    f"Expected exactly one corte.providencias row for id={providencia_id!r}, got {cursor.rowcount}"
                )
