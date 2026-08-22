"""DeepSeek client for judge profile extraction."""

from __future__ import annotations

import json
import time
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

DEEPSEEK_CHAT_COMPLETIONS_URL = "https://api.deepseek.com/chat/completions"
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 2


class DeepSeekService:
    """Call DeepSeek's OpenAI-compatible chat endpoint in JSON mode."""

    def __init__(self, *, api_key: str, model: str) -> None:
        self._api_key = api_key
        self._model = model

    def extract_judge_profile(self, system_prompt: str, user_prompt: str) -> dict[str, Any]:
        """Return a JSON object with the judge profile."""
        payload = {
            "model": self._model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0,
            "max_tokens": 2000,
            "thinking": {"type": "disabled"},
        }

        last_error: Exception | None = None

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                return self._call_api(payload)
            except RuntimeError as error:
                last_error = error
                print(f"[DeepSeek] attempt {attempt}/{MAX_RETRIES} failed: {error}")
                if attempt < MAX_RETRIES:
                    time.sleep(RETRY_DELAY_SECONDS * attempt)

        raise RuntimeError(
            f"DeepSeek failed after {MAX_RETRIES} attempts. Last error: {last_error}"
        ) from last_error

    def _call_api(self, payload: dict[str, Any]) -> dict[str, Any]:
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
            with urlopen(request, timeout=120) as response:
                response_payload = json.loads(response.read().decode("utf-8"))
        except HTTPError as error:
            body = error.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"DeepSeek HTTP {error.code}: {body}") from error
        except URLError as error:
            raise RuntimeError(f"DeepSeek network error: {error.reason}") from error
        except json.JSONDecodeError as error:
            raise RuntimeError("DeepSeek returned invalid response JSON") from error

        try:
            finish_reason = response_payload["choices"][0].get("finish_reason")
            print(f"[DeepSeek] finish_reason={finish_reason}")
        except (IndexError, KeyError, TypeError):
            pass

        try:
            content = response_payload["choices"][0]["message"]["content"]
        except (IndexError, KeyError, TypeError) as error:
            raise RuntimeError(
                f"DeepSeek response has no message content. Full response: {response_payload}"
            ) from error

        if not isinstance(content, str) or not content.strip():
            raise RuntimeError(
                f"DeepSeek returned empty content. Full response: {response_payload}"
            )

        try:
            structured_output = json.loads(content)
        except json.JSONDecodeError as error:
            raise RuntimeError(
                f"DeepSeek returned unparsable JSON. Content was: {content!r}"
            ) from error

        if not isinstance(structured_output, dict):
            raise RuntimeError("DeepSeek structured output must be a JSON object")

        return structured_output
