# syntax=docker/dockerfile:1

FROM rust:1.88.0-bookworm AS liteparse-builder

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        cmake \
        g++ \
        git \
        libclang-dev \
        libleptonica-dev \
        libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build
RUN git clone --depth 1 --branch python-v2.12.0 \
    https://github.com/run-llama/liteparse.git liteparse

WORKDIR /build/liteparse
RUN cargo build --release

FROM python:3.12.11-slim-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        liblept5 \
        libtesseract5 \
        tesseract-ocr-spa \
    && rm -rf /var/lib/apt/lists/*

COPY --from=liteparse-builder /build/liteparse/target/release/lit /usr/local/bin/lit
COPY --from=liteparse-builder /root/.cache/pdfium-rs/ /usr/local/lib/pdfium-rs/

ENV LAMBDA_TASK_ROOT=/var/task
ENV LD_LIBRARY_PATH="/usr/local/lib/pdfium-rs"
ENV PYTHONUNBUFFERED=1

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
