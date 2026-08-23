import { createHighlighter } from "@tanstack/highlight/core";
import { html } from "@tanstack/highlight/languages/html";
import { js } from "@tanstack/highlight/languages/js";
import { json } from "@tanstack/highlight/languages/json";
import { plaintext } from "@tanstack/highlight/languages/plaintext";
import { ts } from "@tanstack/highlight/languages/ts";
import { createTanStackMarkdownHighlighter } from "@tanstack/highlight/markdown";
import type { CodeHighlighter } from "@tanstack/markdown";

const highlighter = createHighlighter({
	languages: [plaintext, json, js, ts, html],
});

export const highlightMarkdownCode: CodeHighlighter =
	createTanStackMarkdownHighlighter(highlighter);
