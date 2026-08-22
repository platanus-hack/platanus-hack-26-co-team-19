# MCP Consejo de Estado (CSV)

Servidor MCP independiente (Bun + Streamable HTTP). Consulta los CSV locales; la capa de datos está pensada para sustituirse por PostgreSQL (`DATA_BACKEND=postgres`) sin cambiar las tools.

## Arranque

```bash
cd services/mcp-server
cp .env.example .env
bun install
bun run dev
```

- Salud (solo local): `GET http://localhost:3333/health`
- MCP vía nginx (puerto 80): `http://<ip-publica>/mcp`

Nginx hace proxy de `/mcp` a Bun en `127.0.0.1:3333`. Fragmento: [`nginx.mcp.conf`](nginx.mcp.conf). Recarga: `sudo nginx -t && sudo systemctl reload nginx`.

### Consumo

URL Streamable HTTP: `http://206.189.200.33/mcp`

En Cursor (`~/.cursor/mcp.json` o ajustes MCP):

```json
{
  "mcpServers": {
    "consejo-estado": {
      "url": "http://206.189.200.33/mcp"
    }
  }
}
```

El endpoint es público: no requiere token.

Prueba rápida:

```bash
curl -s -X POST http://206.189.200.33/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
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
