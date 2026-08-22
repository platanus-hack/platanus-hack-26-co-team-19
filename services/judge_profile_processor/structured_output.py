"""Prompts and payload shaping for judge profile extraction via DeepSeek."""

from __future__ import annotations

from typing import Any

SYSTEM_PROMPT = """
Eres un analista experto en comportamiento judicial colombiano. A partir de los casos proporcionados, genera un perfil objetivo del juez/ponente como si fuera una ficha técnica de rendimiento táctica para abogados.

Responde exclusivamente con un objeto JSON válido con exactamente estas claves, sin Markdown ni texto adicional:

- `tendencia`: usa solo "garantista", "restrictivo" o "neutro". Refleja el patrón predominante en la motivación de sus decisiones frente a derechos y restricciones.

- `favorece_a`: usa solo "ciudadano", "estado", "mixto" o "indeterminado". A quién favorece materialmente en la mayoría de sus fallos.

- `garantismo`: entero de 0 a 100. Qué tan garantista es en sus motivaciones. 100 = siempre protege derechos, 0 = nunca.

- `rigurosidad`: entero de 0 a 100. Qué tan exigente es con requisitos formales y carga probatoria.

- `independencia`: entero de 0 a 100. Qué tan alejado está de la postura del estado o la autoridad pública. 100 = muy independiente.

- `consistencia`: entero de 0 a 100. Qué tan predecible y uniforme es en casos similares.

- `profundidad_juridica`: entero de 0 a 100. Qué tan robusto y extenso es su sustento jurisprudencial.

- `tasa_favorable_ciudadano`: entero de 0 a 100. Porcentaje de fallos que favorecen materialmente al ciudadano/particular.

- `tasa_favorable_estado`: entero de 0 a 100. Porcentaje de fallos que favorecen al estado.

- `tasa_mixto`: entero de 0 a 100. Porcentaje de fallos con resultado mixto.

- `tipos_proceso_frecuentes`: arreglo de hasta 3 strings con los tipos de proceso donde más aparece este juez.

- `inclinado_a`: exactamente un párrafo en español (máximo 4 oraciones) describiendo hacia qué argumentos, posturas y tipos de pretensiones gravita naturalmente este juez.

- `a_favor_de`: exactamente un párrafo en español (máximo 4 oraciones) describiendo qué enfoques, argumentos y estrategias tienen más probabilidad de éxito ante este juez.

- `patron_argumentacion`: exactamente una oración describiendo cómo construye y motiva típicamente sus decisiones.

- `sesgo_observable`: exactamente una oración sobre algún rasgo, inclinación o criterio recurrente y explícitamente observable. Si no hay evidencia, usa exactamente: "No se identifica un sesgo o criterio recurrente explícito en las providencias analizadas."

- `resumen`: exactamente un párrafo en español (máximo 6 oraciones) con el perfil general del juez: patrón de fallos, estilo argumentativo y postura predominante. Este campo se usará como contexto acumulado en futuras actualizaciones del perfil.

Ejemplo de salida válida:
{
  "tendencia": "garantista",
  "favorece_a": "ciudadano",
  "garantismo": 82,
  "rigurosidad": 65,
  "independencia": 74,
  "consistencia": 88,
  "profundidad_juridica": 71,
  "tasa_favorable_ciudadano": 68,
  "tasa_favorable_estado": 22,
  "tasa_mixto": 10,
  "tipos_proceso_frecuentes": ["Nulidad y restablecimiento del derecho", "Reparación directa"],
  "inclinado_a": "Este juez gravita hacia la protección de derechos laborales de funcionarios públicos y tiende a aplicar criterios amplios de reconocimiento de beneficios. Muestra preferencia por argumentos que invocan el principio de favorabilidad y el debido proceso administrativo.",
  "a_favor_de": "Los argumentos con mayor éxito ante este juez son los que documentan detalladamente el vicio del acto administrativo y ofrecen jurisprudencia reciente del Consejo de Estado. Una pretensión bien fundamentada en precedentes vinculantes y con acervo probatorio completo tiene alta probabilidad de prosperar.",
  "patron_argumentacion": "Identifica primero el vicio del acto administrativo y luego ordena el restablecimiento integral del derecho vulnerado apoyándose en precedentes vinculantes.",
  "sesgo_observable": "Muestra una tendencia recurrente a ordenar nulidad total en lugar de nulidad parcial cuando la entidad demandada pertenece a la rama judicial.",
  "resumen": "El juez muestra una inclinación consistente hacia la protección de derechos laborales de funcionarios públicos, ordenando nulidades totales cuando la entidad omite reconocer beneficios legalmente establecidos. Su argumentación se apoya fuertemente en precedentes del Consejo de Estado y principios de debido proceso. Es predecible en casos de nulidad y restablecimiento del derecho y su postura garantista es estable a lo largo del tiempo."
}
""".strip()


def build_create_prompt(judge: dict[str, Any]) -> str:
    """Build prompt for a new judge using all their cases."""
    cases_text = judge.get("cases_text", "")
    ponente = judge["ponente"]
    total_casos = judge["total_casos"]

    return f"""Analiza los siguientes {total_casos} casos del juez/ponente "{ponente}" y genera su perfil completo.

Estadísticas calculadas:
- Total de casos: {total_casos}
- Casos a favor del ciudadano: {judge['casos_ciudadano']}
- Casos a favor del estado: {judge['casos_estado']}
- Casos mixtos: {judge['casos_mixto']}
- Casos indeterminados: {judge['casos_indeterminado']}
- Promedio de citas jurisprudenciales: {judge['citas_promedio']}
- Tipos de proceso: {', '.join(judge.get('tipos_proceso', []))}

Casos analizados:
{cases_text}"""


def build_update_prompt(judge: dict[str, Any]) -> str:
    """Build prompt to update an existing judge profile with new cases."""
    cases_text = judge.get("cases_text", "")
    ponente = judge["ponente"]
    total_casos = judge["total_casos"]
    previous_total = judge.get("previous_total_casos", 0)
    new_cases_count = total_casos - previous_total
    previous_resumen = judge.get("previous_resumen") or "Sin resumen previo."

    return f"""El juez/ponente "{ponente}" tiene un perfil existente. Actualízalo incorporando los {new_cases_count} casos nuevos.

Perfil actual (resumen acumulado):
{previous_resumen}

Estadísticas actualizadas (todos los casos):
- Total de casos: {total_casos}
- Casos a favor del ciudadano: {judge['casos_ciudadano']}
- Casos a favor del estado: {judge['casos_estado']}
- Casos mixtos: {judge['casos_mixto']}
- Casos indeterminados: {judge['casos_indeterminado']}
- Promedio de citas jurisprudenciales: {judge['citas_promedio']}
- Tipos de proceso: {', '.join(judge.get('tipos_proceso', []))}

Casos nuevos (desde la última actualización):
{cases_text}

Genera el perfil completo actualizado considerando tanto el historial previo como los nuevos casos."""
