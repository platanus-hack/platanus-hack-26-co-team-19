import config from "../lib/config.ts";
import { CsvRepository } from "./csv-repository.ts";
import type { DataRepository } from "./types.ts";

export function createRepository(): DataRepository {
  if (config.dataBackend === "postgres") {
    throw new Error(
      "DATA_BACKEND=postgres aún no está implementado. Usa csv o conecta PgRepository más adelante.",
    );
  }
  return new CsvRepository(config.dataDir);
}

export type { DataRepository } from "./types.ts";
