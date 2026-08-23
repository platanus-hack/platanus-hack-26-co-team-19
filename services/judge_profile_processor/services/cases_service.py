"""Fetch judge cases from PostgreSQL and format them as prompt context."""

from __future__ import annotations

from typing import Any

# For new judges: fetch all their COMPLETE cases
ALL_CASES_QUERY = """
SELECT
    radicado, clase_proceso, tipo, actuacion, sentido,
    favorecido, tono, citas_jurisprudencia,
    argumentos_clave, observacion,
    fecha_providencia, anio_radicado, anio_fallo, duracion_anios,
    actor, demandado
FROM corte.providencias
WHERE ponente = %s
  AND status = 'COMPLETE'
ORDER BY fecha_providencia DESC
LIMIT 100
"""

# For updates: only cases newer than what was already processed
NEW_CASES_QUERY = """
SELECT
    radicado, clase_proceso, tipo, actuacion, sentido,
    favorecido, tono, citas_jurisprudencia,
    argumentos_clave, observacion,
    fecha_providencia, anio_radicado, anio_fallo, duracion_anios,
    actor, demandado
FROM corte.providencias
WHERE ponente = %s
  AND status = 'COMPLETE'
ORDER BY fecha_providencia DESC
LIMIT %s
"""


def fetch_cases_text(
    *,
    connection: Any,
    ponente: str,
    action: str,
    new_cases_count: int,
) -> str:
    """Return cases formatted as numbered context for the LLM prompt."""
    from psycopg.rows import dict_row

    with connection.cursor(row_factory=dict_row) as cursor:
        if action == "create":
            cursor.execute(ALL_CASES_QUERY, (ponente,))
        else:
            cursor.execute(NEW_CASES_QUERY, (ponente, new_cases_count))

        cases = cursor.fetchall()

    if not cases:
        return "No se encontraron casos con análisis completo para este juez."

    lines: list[str] = []
    for i, case in enumerate(cases, start=1):
        lines.append(f"--- Caso {i} ---")
        lines.append(f"Radicado: {case.get('radicado', 'N/A')}")
        lines.append(f"Clase de proceso: {case.get('clase_proceso', 'N/A')}")
        lines.append(f"Tipo: {case.get('tipo', 'N/A')}")
        lines.append(f"Actuación: {case.get('actuacion', 'N/A')}")
        lines.append(f"Sentido: {case.get('sentido', 'N/A')}")
        lines.append(f"Favorecido: {case.get('favorecido', 'N/A')}")
        lines.append(f"Tono: {case.get('tono', 'N/A')}")
        lines.append(f"Citas jurisprudenciales: {case.get('citas_jurisprudencia', 0)}")
        lines.append(f"Fecha providencia: {case.get('fecha_providencia', 'N/A')}")
        lines.append(f"Duración (años): {case.get('duracion_anios', 'N/A')}")

        argumentos = case.get("argumentos_clave")
        if argumentos:
            import json
            try:
                args = json.loads(argumentos) if isinstance(argumentos, str) else argumentos
                for j, arg in enumerate(args, start=1):
                    lines.append(f"Argumento {j}: {arg}")
            except (json.JSONDecodeError, TypeError):
                lines.append(f"Argumentos: {argumentos}")

        observacion = case.get("observacion")
        if observacion:
            lines.append(f"Observación: {observacion}")

        lines.append("")

    return "\n".join(lines)
