"""PostgreSQL persistence for structured OCR results."""

from __future__ import annotations

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
    ponente: str,
    completed_status: str,
) -> None:
    """Persist the validated ponente and mark the source row as completed."""
    import psycopg

    missing_settings = [
        name for name in REQUIRED_POSTGRES_SETTINGS if not postgres_settings.get(name)
    ]
    if missing_settings:
        raise RuntimeError(
            "PostgreSQL secret is missing required settings: "
            + ", ".join(missing_settings)
        )

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
            cursor.execute(
                """
                UPDATE corte.providencias
                SET ponente = %s,
                    status = %s
                WHERE id = %s
                """,
                (ponente, completed_status, providencia_id),
            )
            if cursor.rowcount != 1:
                raise LookupError(
                    "Expected exactly one corte.providencias row for the supplied id"
                )
