import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ResultPanel as ResultPanelType } from "../schemas/lawyer-profile.schema";

type ResultPanelProps = {
	panel: ResultPanelType;
};

const SERIES = [
	{
		key: "favorable" as const,
		label: "Favorable",
		className: "bg-emerald-600",
	},
	{
		key: "unfavorable" as const,
		label: "Desfavorable",
		className: "bg-rose-600",
	},
	{
		key: "mixed" as const,
		label: "Mixto",
		className: "bg-amber-500",
	},
	{
		key: "notDeterminable" as const,
		label: "No determinable",
		className: "bg-slate-400",
	},
	{
		key: "pendingOrNoFinalDecision" as const,
		label: "Pendiente o sin decisión final",
		className: "bg-sky-500",
	},
];

export const ResultPanel = ({ panel }: ResultPanelProps) => {
	const total = SERIES.reduce(
		(sum, series) => sum + panel.values[series.key],
		0,
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{panel.title}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{total > 0 ? (
					<div className="flex h-8 w-full overflow-hidden rounded-md">
						{SERIES.map((series) => {
							const value = panel.values[series.key];
							if (value === 0) return null;
							return (
								<div
									key={series.key}
									className={cn("h-full min-w-0", series.className)}
									style={{ width: `${(value / total) * 100}%` }}
									title={`${series.label}: ${value}`}
								/>
							);
						})}
					</div>
				) : (
					<p className="text-sm text-muted-foreground">
						No hay resultados observados.
					</p>
				)}
				<ul className="grid gap-2 sm:grid-cols-2">
					{SERIES.map((series) => (
						<li
							key={series.key}
							className="flex items-center justify-between gap-3 text-sm"
						>
							<span className="flex items-center gap-2">
								<span
									className={cn(
										"size-2.5 shrink-0 rounded-sm",
										series.className,
									)}
								/>
								{series.label}
							</span>
							<span className="tabular-nums text-muted-foreground">
								{panel.values[series.key]}
							</span>
						</li>
					))}
				</ul>
				<Alert>
					<AlertTitle>Aviso</AlertTitle>
					<AlertDescription>{panel.requiredDisclaimer}</AlertDescription>
				</Alert>
			</CardContent>
		</Card>
	);
};
