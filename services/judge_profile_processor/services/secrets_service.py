"""AWS Secrets Manager access for the judge profile processor."""

from __future__ import annotations

import json
from typing import Any


def get_json_secret(secret_arn: str) -> dict[str, Any]:
    """Read and parse a JSON secret without logging its contents."""
    import boto3

    response = boto3.client("secretsmanager").get_secret_value(SecretId=secret_arn)
    secret_string = response.get("SecretString")
    if not isinstance(secret_string, str) or not secret_string:
        raise RuntimeError("Secret has no JSON SecretString value")

    try:
        payload = json.loads(secret_string)
    except json.JSONDecodeError as error:
        raise RuntimeError("Secret contains invalid JSON") from error

    if not isinstance(payload, dict):
        raise RuntimeError("Secret JSON must be an object")
    return payload
