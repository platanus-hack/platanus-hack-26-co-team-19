#!/bin/sh
set -eu

export DISPLAY="${DISPLAY:-:99}"

if [ ! -S "/tmp/.X11-unix/X${DISPLAY#:}" ] && [ ! -f "/tmp/.X${DISPLAY#:}-lock" ]; then
  Xvfb "$DISPLAY" -screen 0 1500x1000x24 -ac &
  sleep 0.4
fi

exec uvicorn api:app --host 0.0.0.0 --port 8000
