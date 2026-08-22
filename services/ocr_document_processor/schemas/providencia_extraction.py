"""Validated structured output returned by DeepSeek for one providencia."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProvidenciaExtraction(BaseModel):
    """Fields extracted from a legal providencia before persistence."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    ponente: str = Field(min_length=1, max_length=500)
    radicado: str | None = Field(default=None, max_length=500)
    temas: list[str] = Field(default_factory=list, max_length=20)
    sentido: str | None = Field(default=None, max_length=500)
    resumen: str | None = Field(default=None, max_length=4000)

    @field_validator("ponente")
    @classmethod
    def require_identified_ponente(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("ponente must be explicitly identified in the document")
        return value
