"""PostgreSQL persistence for judge profiles."""

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


def upsert_judge_profile(
    *,
    postgres_settings: dict[str, Any],
    ponente: str,
    action: str,
    stats: dict[str, Any],
    profile: dict[str, Any],
) -> None:
    """Insert or update a judge profile in corte.jueces_perfiles."""
    import psycopg

    missing_settings = [
        name for name in REQUIRED_POSTGRES_SETTINGS if not postgres_settings.get(name)
    ]
    if missing_settings:
        raise RuntimeError(
            "PostgreSQL secret is missing required settings: "
            + ", ".join(missing_settings)
        )

    import json

    tipos_proceso_json = json.dumps(
        profile.get("tipos_proceso_frecuentes", []), ensure_ascii=False
    )
    fortalezas_json = json.dumps(
        profile.get("fortalezas", []), ensure_ascii=False
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
            if action == "create":
                cursor.execute(
                    """
                    INSERT INTO corte.jueces_perfiles (
                        ponente, sala, seccion, subseccion,
                        total_casos,
                        tendencia, favorece_a,
                        garantismo, rigurosidad, independencia, consistencia, profundidad_juridica,
                        tasa_favorable_ciudadano, tasa_favorable_estado, tasa_mixto,
                        tipos_proceso_frecuentes,
                        inclinado_a, a_favor_de,
                        patron_argumentacion, sesgo_observable,
                        resumen,
                        creado_en, actualizado_en
                    ) VALUES (
                        %s, %s, %s, %s,
                        %s,
                        %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s,
                        %s,
                        %s, %s,
                        %s, %s,
                        %s,
                        NOW(), NOW()
                    )
                    """,
                    (
                        ponente,
                        stats.get("sala"),
                        stats.get("seccion"),
                        stats.get("subseccion"),
                        stats.get("total_casos"),
                        profile.get("tendencia"),
                        profile.get("favorece_a"),
                        profile.get("garantismo"),
                        profile.get("rigurosidad"),
                        profile.get("independencia"),
                        profile.get("consistencia"),
                        profile.get("profundidad_juridica"),
                        profile.get("tasa_favorable_ciudadano"),
                        profile.get("tasa_favorable_estado"),
                        profile.get("tasa_mixto"),
                        tipos_proceso_json,
                        profile.get("inclinado_a"),
                        profile.get("a_favor_de"),
                        profile.get("patron_argumentacion"),
                        profile.get("sesgo_observable"),
                        profile.get("resumen"),
                    ),
                )
            else:
                # update
                cursor.execute(
                    """
                    UPDATE corte.jueces_perfiles
                    SET
                        sala                      = %s,
                        seccion                   = %s,
                        subseccion                = %s,
                        total_casos               = %s,
                        tendencia                 = %s,
                        favorece_a                = %s,
                        garantismo                = %s,
                        rigurosidad               = %s,
                        independencia             = %s,
                        consistencia              = %s,
                        profundidad_juridica      = %s,
                        tasa_favorable_ciudadano  = %s,
                        tasa_favorable_estado     = %s,
                        tasa_mixto                = %s,
                        tipos_proceso_frecuentes  = %s,
                        inclinado_a               = %s,
                        a_favor_de                = %s,
                        patron_argumentacion      = %s,
                        sesgo_observable          = %s,
                        resumen                   = %s,
                        actualizado_en            = NOW()
                    WHERE ponente = %s
                    """,
                    (
                        stats.get("sala"),
                        stats.get("seccion"),
                        stats.get("subseccion"),
                        stats.get("total_casos"),
                        profile.get("tendencia"),
                        profile.get("favorece_a"),
                        profile.get("garantismo"),
                        profile.get("rigurosidad"),
                        profile.get("independencia"),
                        profile.get("consistencia"),
                        profile.get("profundidad_juridica"),
                        profile.get("tasa_favorable_ciudadano"),
                        profile.get("tasa_favorable_estado"),
                        profile.get("tasa_mixto"),
                        tipos_proceso_json,
                        profile.get("inclinado_a"),
                        profile.get("a_favor_de"),
                        profile.get("patron_argumentacion"),
                        profile.get("sesgo_observable"),
                        profile.get("resumen"),
                        ponente,
                    ),
                )
                if cursor.rowcount != 1:
                    raise LookupError(
                        f"Expected exactly one jueces_perfiles row for ponente={ponente!r}, got {cursor.rowcount}"
                    )

        print(f"[postgres] {action} profile for ponente={ponente!r} OK")
