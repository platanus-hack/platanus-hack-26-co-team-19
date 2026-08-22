"""Process one judge: fetch cases, call DeepSeek, upsert profile in PostgreSQL."""

from __future__ import annotations

import os
from typing import Any

import psycopg

from services.cases_service import fetch_cases_text
from services.deepseek_service import DeepSeekService
from services.postgres_service import upsert_judge_profile
from services.secrets_service import get_json_secret
from structured_output import SYSTEM_PROMPT, build_create_prompt, build_update_prompt

REQUIRED_POSTGRES_SETTINGS = (
    "POSTGRES_HOST",
    "POSTGRES_PORT",
    "POSTGRES_DB",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_SSLMODE",
)


def handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    """Build or update a judge profile for one Step Functions Map item."""
    del context

    job = event.get("job")
    if not isinstance(job, dict):
        raise ValueError("Map input must contain a job object")

    ponente = job.get("ponente")
    action = job.get("action")
    if not ponente or action not in ("create", "update"):
        raise ValueError("job requires non-empty ponente and action in (create, update)")

    postgres_secret_arn = os.environ.get("POSTGRES_SECRET_ARN")
    deepseek_secret_arn = os.environ.get("DEEPSEEK_SECRET_ARN")
    if not postgres_secret_arn or not deepseek_secret_arn:
        raise RuntimeError("POSTGRES_SECRET_ARN and DEEPSEEK_SECRET_ARN are required")

    postgres_settings = get_json_secret(postgres_secret_arn)
    deepseek_settings = get_json_secret(deepseek_secret_arn)
    deepseek_api_key = deepseek_settings.get("DEEPSEEK_API_KEY")
    if not isinstance(deepseek_api_key, str) or not deepseek_api_key:
        raise RuntimeError("DeepSeek secret is missing DEEPSEEK_API_KEY")

    total_casos = int(job.get("total_casos") or 0)
    previous_total_casos = int(job.get("previous_total_casos") or 0)
    new_cases_count = max(total_casos - previous_total_casos, total_casos)

    # Fetch case texts directly from DB
    with psycopg.connect(
        host=postgres_settings["POSTGRES_HOST"],
        port=postgres_settings["POSTGRES_PORT"],
        dbname=postgres_settings["POSTGRES_DB"],
        user=postgres_settings["POSTGRES_USER"],
        password=postgres_settings["POSTGRES_PASSWORD"],
        sslmode=postgres_settings["POSTGRES_SSLMODE"],
        connect_timeout=10,
    ) as connection:
        cases_text = fetch_cases_text(
            connection=connection,
            ponente=ponente,
            action=action,
            new_cases_count=new_cases_count,
        )

    # Build prompt
    judge_context = {**job, "cases_text": cases_text}

    if action == "create":
        user_prompt = build_create_prompt(judge_context)
    else:
        user_prompt = build_update_prompt(judge_context)

    # Call DeepSeek
    profile = DeepSeekService(
        api_key=deepseek_api_key,
        model=os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-flash"),
    ).extract_judge_profile(SYSTEM_PROMPT, user_prompt)

    # Stats come from the reader (already calculated in DB)
    stats = {
        "sala": job.get("sala"),
        "seccion": job.get("seccion"),
        "subseccion": job.get("subseccion"),
        "total_casos": total_casos,
    }

    upsert_judge_profile(
        postgres_settings=postgres_settings,
        ponente=ponente,
        action=action,
        stats=stats,
        profile=profile,
    )

    return {
        "ponente": ponente,
        "action": action,
        "total_casos": total_casos,
        "status": "OK",
    }
