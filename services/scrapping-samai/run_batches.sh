#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PY="$DIR/.venv/bin/python3"
if [[ ! -x "$PY" ]]; then
  PY="$(command -v python3)"
fi
SCRAPER="$DIR/scrapping-samai-AWS.py"
LOG="$DIR/batches.log"
ESTADO="$DIR/lote_estado.txt"

desde="${1:-272}"
limite="${2:-15000}"
tam=100
ultimo_ok=""
ultimo_error=""

escribir_estado() {
  local estado="$1" d="$2" p="$3" h="$4"
  cat > "$ESTADO" <<EOF
estado=$estado
desde=$d
paginas=$p
hasta=$h
inicio=$(date -Is)
ultimo_ok=$ultimo_ok
ultimo_error=$ultimo_error
EOF
}

if [[ ! -f "$SCRAPER" ]]; then
  echo "no encuentro $SCRAPER" >&2
  exit 1
fi

if [[ -f "$ESTADO" ]]; then
  ultimo_ok="$(grep '^ultimo_ok=' "$ESTADO" | cut -d= -f2- || true)"
  ultimo_error="$(grep '^ultimo_error=' "$ESTADO" | cut -d= -f2- || true)"
  prev_estado="$(grep '^estado=' "$ESTADO" | cut -d= -f2- || true)"
  prev_desde="$(grep '^desde=' "$ESTADO" | cut -d= -f2- || true)"
  if [[ $# -eq 0 && ( "$prev_estado" == "ERROR" || "$prev_estado" == "EN_CURSO" ) ]]; then
    echo "última corrida quedó en desde=${prev_desde}; usa $0 ${prev_desde}"
  fi
fi

export PYTHONUNBUFFERED=1
unset DISPLAY || true
unset SCRAPER_HEADLESS || true

{
  echo "$(date -Is) inicio desde=$desde limite=$limite tam=$tam python=$PY"
} | tee -a "$LOG"

cd "$DIR"

while [[ "$desde" -le "$limite" ]]; do
  paginas="$tam"
  fin=$((desde + tam - 1))
  if [[ "$fin" -gt "$limite" ]]; then
    paginas=$((limite - desde + 1))
    fin="$limite"
  fi

  escribir_estado "EN_CURSO" "$desde" "$paginas" "$fin"
  echo "$(date -Is) lote paginas=$paginas desde=$desde" | tee -a "$LOG"

  if ! "$PY" "$SCRAPER" "$paginas" "$desde" 2>&1 | tee -a "$LOG"; then
    ultimo_error="$desde"
    escribir_estado "ERROR" "$desde" "$paginas" "$fin"
    echo "$(date -Is) fallo en desde=$desde" | tee -a "$LOG"
    echo "reanuda con: $0 $desde${2:+ $limite}"
    echo "estado: $ESTADO"
    exit 1
  fi

  ultimo_ok="$desde"
  ultimo_error=""
  escribir_estado "OK" "$desde" "$paginas" "$fin"
  desde=$((desde + tam))
done

escribir_estado "COMPLETO" "${ultimo_ok:-$desde}" "$tam" "$limite"
echo "$(date -Is) lotes completos hasta $limite" | tee -a "$LOG"
