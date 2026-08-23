export type Perfil = {
  ponente: string;
  seccion: string;
  total: number;
  sentencias: number;
  autos: number;
  tutelas: number;
  favorables: number;
  desfavorables: number;
  pct_favorable: number;
  dur_prom_anios: number;
  dur_max_anios: number;
  salvamentos_recibidos: number;
  veces_que_salvo_voto: number;
};

export type Providencia = {
  archivo: string;
  tipo_doc: string;
  radicado: string;
  anio_radicado: number | null;
  ponente: string;
  suscribe: string;
  seccion: string;
  subseccion: string;
  instancia: string;
  es_tutela: boolean;
  fecha: string;
  anio_fallo: number | null;
  duracion_anios: number | null;
  actor: string;
  pasivo: string;
  temas: string;
  verbo: string;
  sentido: string;
  n_firmantes: number | null;
  hay_salvamento: boolean;
  resolutiva: string;
};

export type Voto = {
  radicado: string;
  magistrado: string;
  tipo: string;
};

export type SearchProvidenciasQuery = {
  radicado?: string;
  ponente?: string;
  suscribe?: string;
  seccion?: string;
  tipo_doc?: string;
  anio_fallo?: number;
  anio_radicado?: number;
  sentido?: string;
  es_tutela?: boolean;
  q?: string;
  limit: number;
};

export type SearchPerfilesQuery = {
  ponente?: string;
  seccion?: string;
  limit: number;
};

export type SearchVotosQuery = {
  radicado?: string;
  magistrado?: string;
  tipo?: string;
  limit: number;
};

export type DatasetId = "perfiles" | "providencias" | "votos";

export type DatasetInfo = {
  id: DatasetId;
  rowCount: number;
  columns: string[];
};

export interface DataRepository {
  backend: "csv" | "postgres";
  searchProvidencias(query: SearchProvidenciasQuery): Promise<Providencia[]>;
  getProvidencia(params: { radicado?: string; archivo?: string }): Promise<Providencia | null>;
  searchPerfiles(query: SearchPerfilesQuery): Promise<Perfil[]>;
  getPerfil(ponente: string): Promise<Perfil | null>;
  searchVotos(query: SearchVotosQuery): Promise<Voto[]>;
  getDatasetInfo(id: DatasetId): Promise<DatasetInfo>;
}
