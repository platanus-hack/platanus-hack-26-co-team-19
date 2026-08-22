"""Prompts and payload shaping for DeepSeek structured extraction."""

from __future__ import annotations

MAX_OCR_TEXT_CHARACTERS = 120_000

SYSTEM_PROMPT = """
Eres un analista experto de providencias judiciales colombianas. Estudia el texto OCR
proporcionado y extrae únicamente información respaldada explícitamente por el documento.
Debes responder exclusivamente con un objeto json válido, sin Markdown ni texto adicional.
El campo `ponente` es obligatorio y debe contener el nombre completo del magistrado ponente.
No inventes datos: si no puedes identificar el ponente explícitamente, devuelve una cadena vacía
para que el sistema lo rechace. Usa null para los campos opcionales que no estén presentes.

Ejemplo de salida json válida:
{
  "ponente": "Nombre del magistrado ponente",
  "radicado": "11001-03-15-000-2024-00001-00",
  "temas": ["debido proceso", "contratación estatal"],
  "sentido": "Niega",
  "resumen": "Resumen breve y fiel de la decisión."
}
""".strip()


def build_user_prompt(ocr_text: str) -> str:
    """Limit input cost while preserving beginning and conclusion of long documents."""
    normalized_text = ocr_text.strip()
    if not normalized_text:
        raise ValueError("LiteParse returned no OCR text")

    if len(normalized_text) > MAX_OCR_TEXT_CHARACTERS:
        leading_characters = int(MAX_OCR_TEXT_CHARACTERS * 0.75)
        trailing_characters = MAX_OCR_TEXT_CHARACTERS - leading_characters
        normalized_text = (
            normalized_text[:leading_characters]
            + "\n\n[... texto OCR truncado ...]\n\n"
            + normalized_text[-trailing_characters:]
        )

    return "Texto OCR de la providencia:\n\n" + normalized_text
