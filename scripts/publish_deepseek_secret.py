#!/usr/bin/env python3
"""Publish a DeepSeek API key from a local .env file to AWS Secrets Manager."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Publish DEEPSEEK_API_KEY as a JSON Secrets Manager value."
    )
    parser.add_argument("--secret-id", required=True)
    parser.add_argument("--env-file", type=Path, default=Path(".env"))
    parser.add_argument("--region", default="us-east-1")
    parser.add_argument("--dry-run", action="store_true")
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


def main() -> int:
    args = parse_args()
    try:
        load_dotenv(args.env_file)
    except ValueError as error:
        print(error, file=sys.stderr)
        return 2

    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        print("Missing required DEEPSEEK_API_KEY in the local environment file.", file=sys.stderr)
        return 2

    with tempfile.NamedTemporaryFile(
        mode="w", encoding="utf-8", prefix="deepseek-secret-", suffix=".json", delete=False
    ) as temporary_file:
        json.dump({"DEEPSEEK_API_KEY": api_key}, temporary_file, separators=(",", ":"))
        temporary_path = Path(temporary_file.name)
    os.chmod(temporary_path, 0o600)

    try:
        if args.dry_run:
            print("DeepSeek secret payload is valid. No AWS request was made.")
            return 0

        result = subprocess.run(
            [
                "aws",
                "secretsmanager",
                "put-secret-value",
                "--secret-id",
                args.secret_id,
                "--secret-string",
                f"file://{temporary_path}",
                "--region",
                args.region,
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
            print("The DeepSeek secret does not exist yet. Apply terraform/main first.", file=sys.stderr)
        else:
            print("AWS rejected the DeepSeek secret publication. Check credentials and IAM permissions.", file=sys.stderr)
        return result.returncode

    print(f"Published a new DeepSeek secret version to {args.secret_id}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
