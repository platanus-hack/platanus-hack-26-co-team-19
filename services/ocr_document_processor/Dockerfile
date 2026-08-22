# syntax=docker/dockerfile:1

FROM python:3.12.11-slim-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        liblept5 \
        libtesseract5 \
    && rm -rf /var/lib/apt/lists/*

# Pre-download Tesseract language data so LiteParse doesn't try to write to ~/ at runtime
RUN mkdir -p /opt/tessdata \
    && curl -fsSL \
        https://github.com/tesseract-ocr/tessdata/raw/main/spa.traineddata \
        -o /opt/tessdata/spa.traineddata

ENV LAMBDA_TASK_ROOT=/var/task
ENV PYTHONUNBUFFERED=1
ENV TMPDIR=/tmp
ENV TESSDATA_PREFIX=/opt/tessdata

WORKDIR ${LAMBDA_TASK_ROOT}
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir --disable-pip-version-check \
    awslambdaric==3.1.1 \
    -r requirements.txt

COPY handler.py structured_output.py ./
COPY schemas ./schemas
COPY services ./services

ENTRYPOINT ["python", "-m", "awslambdaric"]
CMD ["handler.handler"]
