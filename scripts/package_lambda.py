#!/usr/bin/env python3
"""Build a Lambda-compatible Python staging directory from a service source folder."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Install Python Lambda dependencies into a Linux-compatible staging directory."
    )
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--build-dir", type=Path, required=True)
    parser.add_argument("--platform", default="manylinux2014_x86_64")
    parser.add_argument("--python-version", default="3.12")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate inputs and print the package action without invoking pip.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    source_dir = args.source_dir.resolve()
    build_dir = args.build_dir.resolve()
    handler_path = source_dir / "handler.py"
    requirements_path = source_dir / "requirements.txt"

    if not handler_path.is_file():
        print(f"Lambda handler not found: {handler_path}", file=sys.stderr)
        return 2
    if not requirements_path.is_file():
        print(f"Lambda requirements not found: {requirements_path}", file=sys.stderr)
        return 2

    pip_check = subprocess.run(
        [sys.executable, "-m", "pip", "--version"],
        capture_output=True,
        check=False,
        text=True,
    )
    if pip_check.returncode != 0:
        print(
            "The selected Python interpreter has no pip: "
            f"{sys.executable}. Set Terraform variable lambda_packaging_python "
            "to a Python 3.12 interpreter with pip.",
            file=sys.stderr,
        )
        return 1

    pip_command = [
        sys.executable,
        "-m",
        "pip",
        "install",
        "--disable-pip-version-check",
        "--no-cache-dir",
        "--platform",
        args.platform,
        "--implementation",
        "cp",
        "--python-version",
        args.python_version,
        "--abi",
        f"cp{args.python_version.replace('.', '')}",
        "--only-binary=:all:",
        "--target",
        str(build_dir),
        "-r",
        str(requirements_path),
    ]

    if args.dry_run:
        print(
            "Lambda package inputs are valid. "
            f"Dependencies would be installed for {args.platform}."
        )
        return 0

    shutil.rmtree(build_dir, ignore_errors=True)
    build_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(handler_path, build_dir / handler_path.name)
    shutil.copy2(requirements_path, build_dir / requirements_path.name)

    try:
        subprocess.run(pip_command, check=True)
    except subprocess.CalledProcessError:
        shutil.rmtree(build_dir, ignore_errors=True)
        print("Lambda dependency packaging failed.", file=sys.stderr)
        return 1

    print(f"Built Lambda package staging directory: {build_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
