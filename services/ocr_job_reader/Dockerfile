# syntax=docker/dockerfile:1

FROM python:3.12.11-slim-bookworm

ENV LAMBDA_TASK_ROOT=/var/task
ENV PYTHONUNBUFFERED=1

WORKDIR ${LAMBDA_TASK_ROOT}

COPY requirements.txt ./
RUN python -m pip install --no-cache-dir --disable-pip-version-check \
    awslambdaric==3.1.1 \
    -r requirements.txt

COPY handler.py ./

ENTRYPOINT ["python", "-m", "awslambdaric"]
CMD ["handler.handler"]
