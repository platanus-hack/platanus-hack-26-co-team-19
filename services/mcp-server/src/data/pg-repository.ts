import { Pool } from "pg";
import { normalizeText } from "./text.ts";
import type {
  DataRepository,
  DatasetId,
  DatasetInfo,
  Perfil,
  Providencia,
  SearchPerfilesQuery,
  SearchProvidenciasQuery,
  SearchVotosQuery,
  Voto,
} from "./types.ts";

const PROVIDENCIA_COLUMNS = [
  "archivo",
  "tipo_doc",
  "radicado",
  "anio_radicado",
  "ponente",
  "suscribe",
  "seccion",
  "subseccion",
  "instancia",
  "es_tutela",
  "fecha",
  "anio_fallo",
  "duracion_anios",
  "actor",
  "pasivo",
  "temas",
  "verbo",
  "sentido",
  "n_firmantes",
  "hay_salvamento",
  "resolutiva",
];

const PERFIL_COLUMNS = [
  "ponente",
  "seccion",
  "total",
  "sentencias",
  "autos",
  "tutelas",
  "favorables",
  "desfavorables",
  "pct_favorable",
  "dur_prom_anios",
  "dur_max_anios",
  "salvamentos_recibidos",
  "veces_que_salvo_voto",
];

const VOTO_COLUMNS = ["radicado", "magistrado", "tipo"];

const PROVIDENCIA_SELECT = `
SELECT
  p.id AS archivo,
  COALESCE(p.tipo_doc, '') AS tipo_doc,
  COALESCE(p.radicado, '') AS radicado,
  p.anio_radicado,
  COALESCE(p.ponente, '') AS ponente,
  COALESCE(
    (
      SELECT f.magistrado
      FROM corte.firmantes f
      WHERE f.id = p.id
      ORDER BY f.magistrado
      LIMIT 1
    ),
    p.ponente,
    ''
  ) AS suscribe,
  COALESCE(p.seccion, '') AS seccion,
  COALESCE(p.subseccion, '') AS subseccion,
  '' AS instancia,
  COALESCE(p.es_tutela, false) AS es_tutela,
  COALESCE(p.fecha_providencia::text, '') AS fecha,
  p.anio_fallo,
  p.duracion_anios,
  COALESCE(p.actor, '') AS actor,
  COALESCE(p.demandado, '') AS pasivo,
  COALESCE(
    (
      SELECT string_agg(d.descriptor, '; ' ORDER BY d.descriptor)
      FROM corte.descriptores d
      WHERE d.id = p.id
    ),
    ''
  ) AS temas,
  '' AS verbo,
  COALESCE(p.sentido, '') AS sentido,
  (
    SELECT COUNT(*)::int
    FROM corte.firmantes f
    WHERE f.id = p.id
  ) AS n_firmantes,
  EXISTS (
    SELECT 1
    FROM corte.votos v
    WHERE v.id = p.id
      AND v.tipo ILIKE '%SALVAMENTO%'
  ) AS hay_salvamento,
  COALESCE(
    (
      SELECT string_agg(pr.respuesta, ' ' ORDER BY pr.problema)
      FROM corte.problemas pr
      WHERE pr.id = p.id
        AND pr.respuesta IS NOT NULL
        AND BTRIM(pr.respuesta) <> ''
    ),
    ''
  ) AS resolutiva
FROM corte.providencias p
`;

const PERFIL_SELECT = `
SELECT
  COALESCE(ponente, '') AS ponente,
  COALESCE(seccion, '') AS seccion,
  COALESCE(total, 0)::int AS total,
  COALESCE(sentencias, 0)::int AS sentencias,
  COALESCE(autos, 0)::int AS autos,
  COALESCE(tutelas, 0)::int AS tutelas,
  COALESCE(favorables, 0)::int AS favorables,
  COALESCE(desfavorables, 0)::int AS desfavorables,
  COALESCE(pct_favorable, 0)::float AS pct_favorable,
  COALESCE(dur_prom_anios, 0)::float AS dur_prom_anios,
  COALESCE(dur_max_anios, 0)::int AS dur_max_anios,
  COALESCE(salvamentos_recibidos, 0)::int AS salvamentos_recibidos,
  COALESCE(veces_salvo_voto, 0)::int AS veces_que_salvo_voto
FROM corte.perfiles
`;

function createPool(databaseUrl: string): Pool {
  const url = new URL(databaseUrl);
  const sslMode = url.searchParams.get("sslmode");
  url.searchParams.delete("sslmode");
  return new Pool({
    connectionString: url.toString(),
    ssl:
      sslMode === "require" || sslMode === "verify-full"
        ? { rejectUnauthorized: false }
        : undefined,
  });
}

function likePattern(value: string): string {
  return `%${value}%`;
}

function mapProvidencia(row: Record<string, unknown>): Providencia {
  return {
    archivo: String(row.archivo ?? ""),
    tipo_doc: String(row.tipo_doc ?? ""),
    radicado: String(row.radicado ?? ""),
    anio_radicado: row.anio_radicado == null ? null : Number(row.anio_radicado),
    ponente: String(row.ponente ?? ""),
    suscribe: String(row.suscribe ?? ""),
    seccion: String(row.seccion ?? ""),
    subseccion: String(row.subseccion ?? ""),
    instancia: String(row.instancia ?? ""),
    es_tutela: Boolean(row.es_tutela),
    fecha: String(row.fecha ?? ""),
    anio_fallo: row.anio_fallo == null ? null : Number(row.anio_fallo),
    duracion_anios: row.duracion_anios == null ? null : Number(row.duracion_anios),
    actor: String(row.actor ?? ""),
    pasivo: String(row.pasivo ?? ""),
    temas: String(row.temas ?? ""),
    verbo: String(row.verbo ?? ""),
    sentido: String(row.sentido ?? ""),
    n_firmantes: row.n_firmantes == null ? null : Number(row.n_firmantes),
    hay_salvamento: Boolean(row.hay_salvamento),
    resolutiva: String(row.resolutiva ?? ""),
  };
}

function mapPerfil(row: Record<string, unknown>): Perfil {
  return {
    ponente: String(row.ponente ?? ""),
    seccion: String(row.seccion ?? ""),
    total: Number(row.total ?? 0),
    sentencias: Number(row.sentencias ?? 0),
    autos: Number(row.autos ?? 0),
    tutelas: Number(row.tutelas ?? 0),
    favorables: Number(row.favorables ?? 0),
    desfavorables: Number(row.desfavorables ?? 0),
    pct_favorable: Number(row.pct_favorable ?? 0),
    dur_prom_anios: Number(row.dur_prom_anios ?? 0),
    dur_max_anios: Number(row.dur_max_anios ?? 0),
    salvamentos_recibidos: Number(row.salvamentos_recibidos ?? 0),
    veces_que_salvo_voto: Number(row.veces_que_salvo_voto ?? 0),
  };
}

export class PgRepository implements DataRepository {
  readonly backend = "postgres" as const;
  private readonly pool: Pool;

  constructor(databaseUrl: string) {
    this.pool = createPool(databaseUrl);
  }

  async searchProvidencias(query: SearchProvidenciasQuery): Promise<Providencia[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    const addIlike = (column: string, value?: string) => {
      if (!value) return;
      conditions.push(`${column} ILIKE $${i}`);
      values.push(likePattern(value));
      i += 1;
    };

    addIlike("mapped.radicado", query.radicado);
    addIlike("mapped.ponente", query.ponente);
    addIlike("mapped.suscribe", query.suscribe);
    addIlike("mapped.seccion", query.seccion);
    addIlike("mapped.tipo_doc", query.tipo_doc);
    addIlike("mapped.sentido", query.sentido);

    if (query.anio_fallo !== undefined) {
      conditions.push(`mapped.anio_fallo = $${i}`);
      values.push(query.anio_fallo);
      i += 1;
    }
    if (query.anio_radicado !== undefined) {
      conditions.push(`mapped.anio_radicado = $${i}`);
      values.push(query.anio_radicado);
      i += 1;
    }
    if (query.es_tutela !== undefined) {
      conditions.push(`mapped.es_tutela = $${i}`);
      values.push(query.es_tutela);
      i += 1;
    }
    if (query.q) {
      conditions.push(
        `(mapped.temas ILIKE $${i} OR mapped.actor ILIKE $${i} OR mapped.pasivo ILIKE $${i} OR mapped.resolutiva ILIKE $${i})`,
      );
      values.push(likePattern(query.q));
      i += 1;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    values.push(query.limit);
    const result = await this.pool.query(
      `SELECT * FROM (${PROVIDENCIA_SELECT}) mapped ${where} LIMIT $${i}`,
      values,
    );
    return result.rows.map((row) => mapProvidencia(row as Record<string, unknown>));
  }

  async getProvidencia(params: {
    radicado?: string;
    archivo?: string;
  }): Promise<Providencia | null> {
    if (params.archivo) {
      const byArchivo = await this.pool.query(
        `${PROVIDENCIA_SELECT}
         WHERE p.id ILIKE $1 OR COALESCE(p.s3_key, '') ILIKE $1
         LIMIT 1`,
        [likePattern(params.archivo)],
      );
      if (byArchivo.rows[0]) {
        return mapProvidencia(byArchivo.rows[0] as Record<string, unknown>);
      }
    }
    if (!params.radicado) return null;
    const result = await this.pool.query(
      `SELECT * FROM (${PROVIDENCIA_SELECT}) mapped
       WHERE mapped.radicado ILIKE $1
       LIMIT 1`,
      [likePattern(params.radicado)],
    );
    const row = result.rows[0];
    return row ? mapProvidencia(row as Record<string, unknown>) : null;
  }

  async searchPerfiles(query: SearchPerfilesQuery): Promise<Perfil[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    if (query.ponente) {
      conditions.push(`ponente ILIKE $${i}`);
      values.push(likePattern(query.ponente));
      i += 1;
    }
    if (query.seccion) {
      conditions.push(`seccion ILIKE $${i}`);
      values.push(likePattern(query.seccion));
      i += 1;
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    values.push(query.limit);
    const result = await this.pool.query(
      `${PERFIL_SELECT} ${where} ORDER BY total DESC LIMIT $${i}`,
      values,
    );
    return result.rows.map((row) => mapPerfil(row as Record<string, unknown>));
  }

  async getPerfil(ponente: string): Promise<Perfil | null> {
    const needle = normalizeText(ponente);
    if (!needle) return null;
    const result = await this.pool.query(`${PERFIL_SELECT} WHERE ponente ILIKE $1`, [
      likePattern(ponente),
    ]);
    if (result.rows.length === 0) return null;
    const matches = result.rows.map((row) => mapPerfil(row as Record<string, unknown>));
    matches.sort((a, b) => {
      const byName =
        Math.abs(normalizeText(a.ponente).length - needle.length) -
        Math.abs(normalizeText(b.ponente).length - needle.length);
      if (byName !== 0) return byName;
      return b.total - a.total;
    });
    return matches[0] ?? null;
  }

  async searchVotos(query: SearchVotosQuery): Promise<Voto[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    if (query.radicado) {
      conditions.push(`radicado ILIKE $${i}`);
      values.push(likePattern(query.radicado));
      i += 1;
    }
    if (query.magistrado) {
      conditions.push(`magistrado ILIKE $${i}`);
      values.push(likePattern(query.magistrado));
      i += 1;
    }
    if (query.tipo) {
      conditions.push(`tipo ILIKE $${i}`);
      values.push(likePattern(query.tipo));
      i += 1;
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    values.push(query.limit);
    const result = await this.pool.query(
      `SELECT COALESCE(radicado, '') AS radicado,
              COALESCE(magistrado, '') AS magistrado,
              COALESCE(tipo, '') AS tipo
       FROM corte.votos
       ${where}
       LIMIT $${i}`,
      values,
    );
    return result.rows as Voto[];
  }

  async getDatasetInfo(id: DatasetId): Promise<DatasetInfo> {
    const table =
      id === "perfiles"
        ? "corte.perfiles"
        : id === "providencias"
          ? "corte.providencias"
          : "corte.votos";
    const result = await this.pool.query(`SELECT COUNT(*)::int AS n FROM ${table}`);
    const columns =
      id === "perfiles" ? PERFIL_COLUMNS : id === "providencias" ? PROVIDENCIA_COLUMNS : VOTO_COLUMNS;
    return { id, rowCount: result.rows[0]?.n ?? 0, columns };
  }
}
