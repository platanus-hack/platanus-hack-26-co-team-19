# MCP Consejo de Estado

Servidor MCP independiente (Bun + Streamable HTTP). Consulta PostgreSQL (`corte`) por defecto; los CSV locales siguen disponibles como fallback (`DATA_BACKEND=csv`).

## Arranque

```bash
cd services/mcp-server
cp .env.example .env
# DATABASE_URL = mismo Postgres que web-ui
bun install
bun run dev
```

- Salud (solo local): `GET http://localhost:3333/health` (`backend` es `postgres` o `csv`)
- Público vía Caddy: HTTP `http://<ip-publica>/mcp` y HTTPS `https://<ip-publica>/mcp` (Let’s Encrypt, perfil `shortlived` ~6 días)

Caddy hace proxy de `/mcp*` a Bun en `127.0.0.1:3333` y del resto a Next.js en `127.0.0.1:3000`. Config: [`Caddyfile`](Caddyfile).

### Reverse proxy (Caddy)

Sustituye nginx. HTTP y HTTPS se sirven **sin** redirect 301/308 (un POST MCP Streamable HTTP se rompe si redirige).

HTTPS en la IP usa ACME Let’s Encrypt (`cert_issuer acme` + `profile shortlived`). El certificado es de CA pública, SAN = IP, vigencia ~160 horas; Caddy lo renueva solo. No hace falta `curl -k`.

```bash
# Debian/Ubuntu: paquete oficial de Caddy, luego:
sudo systemctl stop nginx
sudo systemctl disable nginx
sudo cp Caddyfile /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl enable --now caddy
# Abrir 80 y 443 en el firewall
```

Recarga tras editar: `sudo systemctl reload caddy`.

### Backend

| `DATA_BACKEND` | Origen |
| --- | --- |
| `postgres` | Esquema `corte` (`providencias`, `votos`, vista `perfiles`, descriptores/firmantes/problemas) |
| `csv` | `perfiles.csv`, `providencias.csv`, `votos.csv` en `DATA_DIR` |

### Consumo

HTTPS (recomendado, cert público): `https://206.189.200.33/mcp`

HTTP (sin redirect; clientes que no soporten IP en SAN): `http://206.189.200.33/mcp`

En Cursor (`~/.cursor/mcp.json` o ajustes MCP):

```json
{
  "mcpServers": {
    "consejo-estado": {
      "url": "https://206.189.200.33/mcp"
    }
  }
}
```

El endpoint es público: no requiere token.

Prueba HTTP (no debe devolver 301/308):

```bash
curl -sS -D - -X POST http://206.189.200.33/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

Prueba HTTPS (sin `-k`):

```bash
curl -sS -D - -X POST https://206.189.200.33/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

Comprobar emisor:

```bash
echo | openssl s_client -connect 206.189.200.33:443 -servername 206.189.200.33 2>/dev/null \
  | openssl x509 -noout -issuer -dates -ext subjectAltName
```

## Tools

| Tool | Uso |
| --- | --- |
| `search_providencias` | Filtros por radicado, ponente, sección, tipo, año, sentido, tutela y texto libre |
| `get_providencia` | Detalle por `radicado` o `archivo` |
| `search_perfiles` | Listado de métricas de ponentes |
| `get_perfil` | Perfil de un ponente (coincidencia parcial) |
| `search_votos` | Salvamentos / aclaraciones por radicado o magistrado |

Recursos: `dataset://perfiles`, `dataset://providencias`, `dataset://votos`.
