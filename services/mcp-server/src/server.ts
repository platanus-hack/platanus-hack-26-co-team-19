import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { DataRepository } from "./data/repository.ts";
import { clampLimit, truncate } from "./data/text.ts";
import type { DatasetId, Providencia } from "./data/types.ts";

function json(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

function summarizeProvidencia(p: Providencia) {
  const resolutiva = truncate(p.resolutiva);
  return {
    archivo: p.archivo,
    tipo_doc: p.tipo_doc,
    radicado: p.radicado,
    anio_radicado: p.anio_radicado,
    ponente: p.ponente,
    suscribe: p.suscribe,
    seccion: p.seccion,
    subseccion: p.subseccion,
    instancia: p.instancia,
    es_tutela: p.es_tutela,
    fecha: p.fecha,
    anio_fallo: p.anio_fallo,
    duracion_anios: p.duracion_anios,
    actor: p.actor,
    pasivo: p.pasivo,
    temas: p.temas,
    verbo: p.verbo,
    sentido: p.sentido,
    n_firmantes: p.n_firmantes,
    hay_salvamento: p.hay_salvamento,
    resolutiva: resolutiva.text,
    resolutiva_truncated: resolutiva.truncated,
  };
}

export function createMcpServer(repo: DataRepository): McpServer {
  const server = new McpServer({
    name: "ce-mcp-server",
    version: "0.1.0",
  });

  server.tool(
    "search_providencias",
    "Busca providencias del Consejo de Estado por radicado, ponente, sección, tipo, año, sentido o texto libre.",
    {
      radicado: z.string().optional(),
      ponente: z.string().optional(),
      suscribe: z.string().optional(),
      seccion: z.string().optional(),
      tipo_doc: z.string().optional(),
      anio_fallo: z.number().int().optional(),
      anio_radicado: z.number().int().optional(),
      sentido: z.string().optional(),
      es_tutela: z.boolean().optional(),
      q: z.string().optional().describe("Texto en temas, actor, pasivo o resolutiva"),
      limit: z.number().int().min(1).max(50).optional(),
    },
    async (args) => {
      const limit = clampLimit(args.limit);
      const rows = repo.searchProvidencias({ ...args, limit }).map(summarizeProvidencia);
      return json({ count: rows.length, limit, backend: repo.backend, rows });
    },
  );

  server.tool(
    "get_providencia",
    "Obtiene una providencia completa por radicado o nombre de archivo.",
    {
      radicado: z.string().optional(),
      archivo: z.string().optional(),
    },
    async (args) => {
      if (!args.radicado && !args.archivo) {
        return json({ error: "Indica radicado o archivo" });
      }
      const row = repo.getProvidencia(args);
      if (!row) {
        return json({ error: "Providencia no encontrada", ...args });
      }
      return json(row);
    },
  );

  server.tool(
    "search_perfiles",
    "Lista perfiles estadísticos de ponentes (sección, volumen, % favorable, duraciones, salvamentos).",
    {
      ponente: z.string().optional(),
      seccion: z.string().optional(),
      limit: z.number().int().min(1).max(50).optional(),
    },
    async (args) => {
      const limit = clampLimit(args.limit);
      const rows = repo.searchPerfiles({ ...args, limit });
      return json({ count: rows.length, limit, backend: repo.backend, rows });
    },
  );

  server.tool(
    "get_perfil",
    "Devuelve el perfil de un ponente por coincidencia parcial del nombre.",
    {
      ponente: z.string().min(1),
    },
    async (args) => {
      const row = repo.getPerfil(args.ponente);
      if (!row) {
        return json({ error: "Perfil no encontrado", ponente: args.ponente });
      }
      return json(row);
    },
  );

  server.tool(
    "search_votos",
    "Busca salvamentos y aclaraciones de voto por radicado, magistrado o tipo.",
    {
      radicado: z.string().optional(),
      magistrado: z.string().optional(),
      tipo: z.string().optional().describe("SALVAMENTO o ACLARACION"),
      limit: z.number().int().min(1).max(50).optional(),
    },
    async (args) => {
      const limit = clampLimit(args.limit);
      const rows = repo.searchVotos({ ...args, limit });
      return json({ count: rows.length, limit, backend: repo.backend, rows });
    },
  );

  const datasetTemplate = new ResourceTemplate("dataset://{id}", {
    list: async () => ({
      resources: (["perfiles", "providencias", "votos"] as DatasetId[]).map((id) => ({
        uri: `dataset://${id}`,
        name: id,
        mimeType: "application/json",
      })),
    }),
  });

  server.resource("datasets", datasetTemplate, async (uri, vars) => {
    const id = String(vars.id) as DatasetId;
    if (id !== "perfiles" && id !== "providencias" && id !== "votos") {
      throw new Error(`Dataset desconocido: ${id}`);
    }
    const info = repo.getDatasetInfo(id);
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify({ ...info, backend: repo.backend }, null, 2),
        },
      ],
    };
  });

  return server;
}
