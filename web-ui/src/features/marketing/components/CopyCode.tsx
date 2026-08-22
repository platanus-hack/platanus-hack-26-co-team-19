"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyCode({
	value,
	label = "Copiar",
}: {
	value: string;
	label?: string;
}) {
	const [copied, setCopied] = useState(false);

	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			onClick={async () => {
				await navigator.clipboard.writeText(value);
				setCopied(true);
				window.setTimeout(() => setCopied(false), 2000);
			}}
		>
			{copied ? (
				<CheckIcon className="size-4" />
			) : (
				<CopyIcon className="size-4" />
			)}
			{copied ? "Copiado" : label}
		</Button>
	);
}
