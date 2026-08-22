import { z } from "zod";

const { MCP_PORT, DATA_DIR, DATA_BACKEND, DATABASE_URL } = process.env;

const envSchema = z
  .object({
    MCP_PORT: z.coerce.number().int().positive().default(3333),
    DATA_DIR: z.string().min(1).default("."),
    DATA_BACKEND: z.enum(["csv", "postgres"]).default("csv"),
    DATABASE_URL: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.DATA_BACKEND === "postgres" && !env.DATABASE_URL?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["DATABASE_URL"],
        message: "DATABASE_URL es obligatorio cuando DATA_BACKEND=postgres",
      });
    }
  });

const parsedEnv = envSchema.parse({
  MCP_PORT,
  DATA_DIR,
  DATA_BACKEND,
  DATABASE_URL,
});

const config = {
  port: parsedEnv.MCP_PORT,
  dataDir: parsedEnv.DATA_DIR,
  dataBackend: parsedEnv.DATA_BACKEND,
  databaseUrl: parsedEnv.DATABASE_URL,
};

export default config;
