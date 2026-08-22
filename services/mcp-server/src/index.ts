import cors from "cors";
import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createRepository } from "./data/repository.ts";
import config from "./lib/config.ts";
import { createMcpServer } from "./server.ts";

const repo = createRepository();
const { port } = config;

const app = express();
app.use(cors());
app.use(express.json({ limit: "4mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, backend: repo.backend });
});

app.post("/mcp", async (req, res) => {
  const server = createMcpServer(repo);
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  res.on("close", () => {
    void transport.close();
    void server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.get("/mcp", (_req, res) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed." },
    id: null,
  });
});

app.delete("/mcp", (_req, res) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed." },
    id: null,
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`MCP listening on http://0.0.0.0:${port}/mcp (backend=${repo.backend})`);
});
