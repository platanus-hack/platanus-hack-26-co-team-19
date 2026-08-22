"""DeepSeek V4 Flash client for validated JSON extraction."""

from __future__ import annotations

import json
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from structured_output import SYSTEM_PROMPT, build_user_prompt

DEEPSEEK_CHAT_COMPLETIONS_URL = "https://api.deepseek.com/chat/completions"


class DeepSeekService:
    """Call DeepSeek's OpenAI-compatible chat endpoint in JSON mode."""

    def __init__(self, *, api_key: str, model: str) -> None:
        self._api_key = api_key
        self._model = model

    def extract_providencia(self, ocr_text: str) -> dict[str, Any]:
        """Return a JSON object suitable for ProvidenciaExtraction validation."""
        payload = {
            "model": self._model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": build_user_prompt(ocr_text)},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0,
            "max_tokens": 1000,
        }
        request = Request(
            DEEPSEEK_CHAT_COMPLETIONS_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self._api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        try:
            with urlopen(request, timeout=60) as response:
                response_payload = json.loads(response.read().decode("utf-8"))
        except HTTPError as error:
            raise RuntimeError(f"DeepSeek request failed with HTTP {error.code}") from error
        except URLError as error:
            raise RuntimeError("DeepSeek request could not reach the API") from error
        except json.JSONDecodeError as error:
            raise RuntimeError("DeepSeek returned invalid response JSON") from error

        try:
            content = response_payload["choices"][0]["message"]["content"]
        except (IndexError, KeyError, TypeError) as error:
            raise RuntimeError("DeepSeek response has no message content") from error

        if not isinstance(content, str) or not content.strip():
            raise RuntimeError("DeepSeek returned empty JSON content")

        try:
            structured_output = json.loads(content)
        except json.JSONDecodeError as error:
            raise RuntimeError("DeepSeek JSON mode returned unparsable content") from error

        if not isinstance(structured_output, dict):
            raise RuntimeError("DeepSeek structured output must be a JSON object")
        return structured_output
