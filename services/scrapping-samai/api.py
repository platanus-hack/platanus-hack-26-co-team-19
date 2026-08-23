import importlib.util
import os
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

_SCRAPER_PATH = Path(__file__).with_name("scrapping-samai-AWS.py")
_spec = importlib.util.spec_from_file_location("scrapping_samai_aws", _SCRAPER_PATH)
if _spec is None or _spec.loader is None:
    raise RuntimeError(f"cannot load scraper from {_SCRAPER_PATH}")
_scraper = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_scraper)

app = FastAPI(title="scrapping-samai")

_jobs: dict[str, dict[str, Any]] = {}
_lock = threading.Lock()
_busy = False


class JobRequest(BaseModel):
    paginas: int = Field(default=10, ge=1, le=500)
    desde: int = Field(default=1, ge=1)


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _require_token(authorization: str | None = Header(default=None)) -> None:
    expected = os.getenv("SCRAPER_TOKEN", "")
    if not expected:
        raise HTTPException(status_code=500, detail="SCRAPER_TOKEN is not configured")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="missing bearer token")
    if authorization.removeprefix("Bearer ").strip() != expected:
        raise HTTPException(status_code=401, detail="invalid token")


def _run_job(job_id: str, paginas: int, desde: int) -> None:
    global _busy
    with _lock:
        _jobs[job_id]["status"] = "running"
        _jobs[job_id]["started_at"] = _now()
    try:
        summary = _scraper.run(paginas, desde)
        with _lock:
            _jobs[job_id]["status"] = "done"
            _jobs[job_id]["finished_at"] = _now()
            _jobs[job_id]["summary"] = summary
    except Exception as exc:
        with _lock:
            _jobs[job_id]["status"] = "error"
            _jobs[job_id]["finished_at"] = _now()
            _jobs[job_id]["error"] = f"{type(exc).__name__}: {exc}"
    finally:
        with _lock:
            _busy = False


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/jobs")
def create_job(body: JobRequest, _: None = Depends(_require_token)) -> dict[str, Any]:
    global _busy
    job_id = str(uuid.uuid4())
    with _lock:
        if _busy:
            raise HTTPException(status_code=409, detail="a scrape job is already running")
        _busy = True
        _jobs[job_id] = {
            "id": job_id,
            "status": "queued",
            "paginas": body.paginas,
            "desde": body.desde,
            "created_at": _now(),
            "started_at": None,
            "finished_at": None,
            "summary": None,
            "error": None,
        }
    threading.Thread(
        target=_run_job,
        args=(job_id, body.paginas, body.desde),
        daemon=True,
    ).start()
    return _jobs[job_id]


@app.get("/jobs/{job_id}")
def get_job(job_id: str, _: None = Depends(_require_token)) -> dict[str, Any]:
    with _lock:
        job = _jobs.get(job_id)
        if job is None:
            raise HTTPException(status_code=404, detail="job not found")
        return job
