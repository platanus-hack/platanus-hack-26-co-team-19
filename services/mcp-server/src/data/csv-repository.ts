import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";
import {
  includesNormalized,
  normalizeText,
  toBool,
  toNumber,
} from "./text.ts";
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

function loadCsv(dataDir: string, filename: string): Record<string, string>[] {
  const raw = readFileSync(join(dataDir, filename), "utf8");
  return parse(raw, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as Record<string, string>[];
}

function mapPerfil(row: Record<string, string>): Perfil {
  return {
    ponente: row.ponente ?? "",
    seccion: row.seccion ?? "",
    total: toNumber(row.total ?? "") ?? 0,
    sentencias: toNumber(row.sentencias ?? "") ?? 0,
    autos: toNumber(row.autos ?? "") ?? 0,
    tutelas: toNumber(row.tutelas ?? "") ?? 0,
    favorables: toNumber(row.favorables ?? "") ?? 0,
    desfavorables: toNumber(row.desfavorables ?? "") ?? 0,
    pct_favorable: toNumber(row.pct_favorable ?? "") ?? 0,
    dur_prom_anios: toNumber(row.dur_prom_anios ?? "") ?? 0,
    dur_max_anios: toNumber(row.dur_max_anios ?? "") ?? 0,
    salvamentos_recibidos: toNumber(row.salvamentos_recibidos ?? "") ?? 0,
    veces_que_salvo_voto: toNumber(row.veces_que_salvo_voto ?? "") ?? 0,
  };
}

function mapProvidencia(row: Record<string, string>): Providencia {
  return {
    archivo: row.archivo ?? "",
    tipo_doc: row.tipo_doc ?? "",
    radicado: row.radicado ?? "",
    anio_radicado: toNumber(row.anio_radicado ?? ""),
    ponente: row.ponente ?? "",
    suscribe: row.suscribe ?? "",
    seccion: row.seccion ?? "",
    subseccion: row.subseccion ?? "",
    instancia: row.instancia ?? "",
    es_tutela: toBool(row.es_tutela ?? ""),
    fecha: row.fecha ?? "",
    anio_fallo: toNumber(row.anio_fallo ?? ""),
    duracion_anios: toNumber(row.duracion_anios ?? ""),
    actor: row.actor ?? "",
    pasivo: row.pasivo ?? "",
    temas: row.temas ?? "",
    verbo: row.verbo ?? "",
    sentido: row.sentido ?? "",
    n_firmantes: toNumber(row.n_firmantes ?? ""),
    hay_salvamento: toBool(row.hay_salvamento ?? ""),
    resolutiva: row.resolutiva ?? "",
  };
}

function mapVoto(row: Record<string, string>): Voto {
  return {
    radicado: row.radicado ?? "",
    magistrado: row.magistrado ?? "",
    tipo: row.tipo ?? "",
  };
}

export class CsvRepository implements DataRepository {
  readonly backend = "csv" as const;
  private perfiles: Perfil[];
  private providencias: Providencia[];
  private votos: Voto[];

  constructor(dataDir: string) {
    this.perfiles = loadCsv(dataDir, "perfiles.csv").map(mapPerfil);
    this.providencias = loadCsv(dataDir, "providencias.csv").map(mapProvidencia);
    this.votos = loadCsv(dataDir, "votos.csv").map(mapVoto);
  }

  searchProvidencias(query: SearchProvidenciasQuery): Providencia[] {
    return this.providencias
      .filter((p) => {
        if (query.radicado && !includesNormalized(p.radicado, query.radicado)) return false;
        if (query.ponente && !includesNormalized(p.ponente, query.ponente)) return false;
        if (query.suscribe && !includesNormalized(p.suscribe, query.suscribe)) return false;
        if (query.seccion && !includesNormalized(p.seccion, query.seccion)) return false;
        if (query.tipo_doc && !includesNormalized(p.tipo_doc, query.tipo_doc)) return false;
        if (query.sentido && !includesNormalized(p.sentido, query.sentido)) return false;
        if (query.anio_fallo !== undefined && p.anio_fallo !== query.anio_fallo) return false;
        if (query.anio_radicado !== undefined && p.anio_radicado !== query.anio_radicado) {
          return false;
        }
        if (query.es_tutela !== undefined && p.es_tutela !== query.es_tutela) return false;
        if (query.q) {
          const blob = `${p.temas} ${p.actor} ${p.pasivo} ${p.resolutiva}`;
          if (!includesNormalized(blob, query.q)) return false;
        }
        return true;
      })
      .slice(0, query.limit);
  }

  getProvidencia(params: { radicado?: string; archivo?: string }): Providencia | null {
    const byArchivo = params.archivo
      ? this.providencias.find((p) => includesNormalized(p.archivo, params.archivo ?? ""))
      : undefined;
    if (byArchivo) return byArchivo;
    if (!params.radicado) return null;
    return (
      this.providencias.find((p) => includesNormalized(p.radicado, params.radicado ?? "")) ?? null
    );
  }

  searchPerfiles(query: SearchPerfilesQuery): Perfil[] {
    return this.perfiles
      .filter((p) => {
        if (query.ponente && !includesNormalized(p.ponente, query.ponente)) return false;
        if (query.seccion && !includesNormalized(p.seccion, query.seccion)) return false;
        return true;
      })
      .slice(0, query.limit);
  }

  getPerfil(ponente: string): Perfil | null {
    const needle = normalizeText(ponente);
    if (!needle) return null;
    const matches = this.perfiles.filter((p) => includesNormalized(p.ponente, ponente));
    if (matches.length === 0) return null;
    matches.sort(
      (a, b) =>
        Math.abs(normalizeText(a.ponente).length - needle.length) -
        Math.abs(normalizeText(b.ponente).length - needle.length),
    );
    return matches[0] ?? null;
  }

  searchVotos(query: SearchVotosQuery): Voto[] {
    return this.votos
      .filter((v) => {
        if (query.radicado && !includesNormalized(v.radicado, query.radicado)) return false;
        if (query.magistrado && !includesNormalized(v.magistrado, query.magistrado)) return false;
        if (query.tipo && !includesNormalized(v.tipo, query.tipo)) return false;
        return true;
      })
      .slice(0, query.limit);
  }

  getDatasetInfo(id: DatasetId): DatasetInfo {
    const map: Record<DatasetId, { rows: unknown[]; columns: string[] }> = {
      perfiles: {
        rows: this.perfiles,
        columns: [
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
        ],
      },
      providencias: {
        rows: this.providencias,
        columns: [
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
        ],
      },
      votos: {
        rows: this.votos,
        columns: ["radicado", "magistrado", "tipo"],
      },
    };
    const ds = map[id];
    return { id, rowCount: ds.rows.length, columns: ds.columns };
  }
}
