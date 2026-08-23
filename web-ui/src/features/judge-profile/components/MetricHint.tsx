"use client";

import { CircleHelp } from "lucide-react";
import type { ReactNode } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type MetricHintProps = {
	hint: string;
	children: ReactNode;
	className?: string;
	label?: string;
};

export const MetricHint = ({
	hint,
	children,
	className,
	label = "Qué significa",
}: MetricHintProps) => {
	return (
		<span className={cn("inline-flex min-w-0 items-center gap-1", className)}>
			{children}
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						type="button"
						className="inline-flex shrink-0 text-muted-foreground hover:text-foreground"
						aria-label={label}
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
						}}
					>
						<CircleHelp className="size-3.5" aria-hidden="true" />
					</button>
				</TooltipTrigger>
				<TooltipContent className="max-w-xs text-pretty">{hint}</TooltipContent>
			</Tooltip>
		</span>
	);
};
