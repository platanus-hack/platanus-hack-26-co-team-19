#!/usr/bin/env python3
"""Publish PostgreSQL settings from a local .env file to AWS Secrets Manager."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Final

REQUIRED_POSTGRES_VARIABLES: Final = (
    "POSTGRES_HOST",
    "POSTGRES_PORT",
    "POSTGRES_DB",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_SSLMODE",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Publish PostgreSQL environment values as one Secrets Manager JSON secret."
    )
    parser.add_argument(
        "--env-file",
        type=Path,
        default=Path(".env"),
        help="Local environment file to read (default: .env).",
    )
    parser.add_argument(
        "--secret-id",
        required=True,
        help="Existing Secrets Manager secret name or ARN created by Terraform.",
    )
    parser.add_argument(
        "--region",
        default=os.environ.get("AWS_REGION")
        or os.environ.get("AWS_DEFAULT_REGION")
        or "us-east-1",
        help="AWS region for Secrets Manager (default: us-east-1).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate the input without making an AWS API request.",
    )
    return parser.parse_args()


def load_dotenv(path: Path) -> None:
    if not path.is_file():
        raise ValueError(f"Environment file not found: {path}")

    loaded_names: set[str] = set()
    for line_number, raw_line in enumerate(path.read_text().splitlines(), start=1):
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue

        if line.startswith("export "):
            line = line.removeprefix("export ").lstrip()

        name, separator, value = line.partition("=")
        name = name.strip()
        if not separator or not name.isidentifier():
            raise ValueError(f"Invalid environment assignment at {path}:{line_number}")

        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]

        os.environ[name] = value
        loaded_names.add(name)

    static_aws_keys = {"AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"}
    if static_aws_keys.issubset(loaded_names) and "AWS_SESSION_TOKEN" not in loaded_names:
        os.environ.pop("AWS_SESSION_TOKEN", None)


def build_secret_payload() -> dict[str, str]:
    missing = [name for name in REQUIRED_POSTGRES_VARIABLES if not os.environ.get(name)]
    if missing:
        raise ValueError(
            "Missing required PostgreSQL variables: " + ", ".join(missing)
        )

    return {name: os.environ[name] for name in REQUIRED_POSTGRES_VARIABLES}


def publish_secret(
    payload: dict[str, str], secret_id: str, region: str, dry_run: bool
) -> int:
    with tempfile.NamedTemporaryFile(
        mode="w", encoding="utf-8", prefix="postgres-secret-", suffix=".json", delete=False
    ) as temporary_file:
        json.dump(payload, temporary_file, separators=(",", ":"))
        temporary_path = Path(temporary_file.name)

    os.chmod(temporary_path, 0o600)

    try:
        if dry_run:
            print("PostgreSQL secret payload is valid. No AWS request was made.")
            return 0

        result = subprocess.run(
            [
                "aws",
                "secretsmanager",
                "put-secret-value",
                "--secret-id",
                secret_id,
                "--secret-string",
                f"file://{temporary_path}",
                "--region",
                region,
                "--no-cli-pager",
            ],
            capture_output=True,
            check=False,
            text=True,
        )
    except FileNotFoundError:
        print("AWS CLI was not found. Install it before publishing the secret.", file=sys.stderr)
        return 1
    finally:
        temporary_path.unlink(missing_ok=True)

    if result.returncode != 0:
        if "ResourceNotFoundException" in result.stderr:
            print(
                "The secret does not exist yet. Apply terraform/main before publishing its value.",
                file=sys.stderr,
            )
        else:
            print("AWS rejected the secret publication. Check your credentials and IAM permissions.", file=sys.stderr)
        return result.returncode

    print(f"Published a new PostgreSQL secret version to {secret_id}.")
    return 0


def main() -> int:
    args = parse_args()

    try:
        load_dotenv(args.env_file)
        payload = build_secret_payload()
    except ValueError as error:
        print(error, file=sys.stderr)
        return 2

    return publish_secret(payload, args.secret_id, args.region, args.dry_run)


if __name__ == "__main__":
    raise SystemExit(main())
