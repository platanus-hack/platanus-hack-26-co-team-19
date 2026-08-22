# syntax=docker/dockerfile:1

FROM python:3.12.11-slim-bookworm

ENV PYTHONUNBUFFERED=1 \
    CHROME_BIN=/usr/bin/chromium \
    TMP=/tmp/_descargas \
    DISPLAY=:99

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        chromium \
        chromium-driver \
        fonts-liberation \
        libnss3 \
        libatk-bridge2.0-0 \
        libgtk-3-0 \
        libasound2 \
        ca-certificates \
        xvfb \
        xauth \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN python -m pip install --no-cache-dir --disable-pip-version-check -r requirements.txt

COPY scrapping-samai-AWS.py api.py entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 8000

CMD ["./entrypoint.sh"]
