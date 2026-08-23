import config from "../lib/config.ts";
import { CsvRepository } from "./csv-repository.ts";
import { PgRepository } from "./pg-repository.ts";
import type { DataRepository } from "./types.ts";

export function createRepository(): DataRepository {
  if (config.dataBackend === "postgres") {
    if (!config.databaseUrl?.trim()) {
      throw new Error("DATABASE_URL es obligatorio cuando DATA_BACKEND=postgres");
    }
    return new PgRepository(config.databaseUrl);
  }
  return new CsvRepository(config.dataDir);
}

export type { DataRepository } from "./types.ts";
