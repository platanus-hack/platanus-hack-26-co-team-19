"""Validated judicial-analysis output returned by DeepSeek for one providencia."""

from __future__ import annotations

from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field

Favorecido = Literal["estado", "ciudadano", "mixto", "indeterminado"]
Tono = Literal["garantista", "restrictivo", "neutro"]
SpanishSentence = Annotated[str, Field(min_length=1, max_length=1_000)]


class ProvidenciaExtraction(BaseModel):
    """Validated analysis extracted from a legal providencia before completion."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    favorecido: Favorecido
    argumentos_clave: list[SpanishSentence] = Field(max_length=3)
    citas_jurisprudencia: int = Field(ge=0)
    tono: Tono
    observacion: SpanishSentence
