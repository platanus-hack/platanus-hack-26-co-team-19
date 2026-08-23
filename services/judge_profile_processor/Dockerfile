# syntax=docker/dockerfile:1

FROM python:3.12.11-slim-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV LAMBDA_TASK_ROOT=/var/task
ENV PYTHONUNBUFFERED=1

WORKDIR ${LAMBDA_TASK_ROOT}
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir --disable-pip-version-check \
    awslambdaric==3.1.1 \
    -r requirements.txt

COPY handler.py structured_output.py ./
COPY services ./services

ENTRYPOINT ["python", "-m", "awslambdaric"]
CMD ["handler.handler"]
