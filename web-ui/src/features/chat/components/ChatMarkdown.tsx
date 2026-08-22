"use client";

import { createThemeCss } from "@tanstack/highlight/theme";
import { githubDarkTheme } from "@tanstack/highlight/themes/github-dark";
import { githubLightTheme } from "@tanstack/highlight/themes/github-light";
import { streamingMarkdownExtension } from "@tanstack/markdown/extensions/streaming";
import { parseMarkdown } from "@tanstack/markdown/parser";
import { Markdown, type MarkdownComponents } from "@tanstack/markdown/react";
import { useMemo } from "react";
import { highlightMarkdownCode } from "@/features/chat/lib/chat-markdown-highlighter";

const streamingExtensions = [streamingMarkdownExtension()];

const markdownComponents = {
	a(props) {
		const external = props.href?.startsWith("http") ?? false;
		return (
			<a
				{...props}
				rel={external ? "nofollow noopener noreferrer" : props.rel}
				target={external ? "_blank" : props.target}
			/>
		);
	},
} satisfies MarkdownComponents;

const highlightThemeCss = createThemeCss({
	light: githubLightTheme,
	dark: githubDarkTheme,
	lightSelector: ".chat-markdown",
	darkSelector: ".dark .chat-markdown",
	codeBlockSelector: ".chat-markdown pre.tm-code",
	lineNumbersSelector: ".chat-markdown .tm-code--line-numbers",
});

type ChatMarkdownProps = {
	text: string;
};

const ChatMarkdown = ({ text }: ChatMarkdownProps) => {
	const document = useMemo(
		() =>
			parseMarkdown(text, {
				extensions: streamingExtensions,
				frontmatter: false,
				headingIds: false,
			}),
		[text],
	);

	return (
		<div className="chat-markdown markdown-renderer text-sm leading-relaxed">
			<style>{highlightThemeCss}</style>
			<Markdown
				components={markdownComponents}
				extensions={streamingExtensions}
				frontmatter={false}
				headingIds={false}
				highlighter={highlightMarkdownCode}
			>
				{document}
			</Markdown>
		</div>
	);
};

export default ChatMarkdown;
