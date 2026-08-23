import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GLOSSARY } from "../glossary";
import {
	DISCLAIMER,
	type JudgePublicProfile,
} from "../schemas/judge-profile.schema";
import { MetricHint } from "./MetricHint";

type ResultPanelProps = {
	profile: JudgePublicProfile;
};

const SERIES = [
	{
		key: "favorable" as const,
		label: "Favorable",
		className: "bg-emerald-600",
		hint: GLOSSARY.favorable,
	},
	{
		key: "desfavorable" as const,
		label: "Desfavorable",
		className: "bg-rose-600",
		hint: GLOSSARY.desfavorable,
	},
	{
		key: "mixto" as const,
		label: "Mixto",
		className: "bg-amber-500",
		hint: GLOSSARY.mixtoSentido,
	},
	{
		key: "otro" as const,
		label: "Otro / sin clasificar",
		className: "bg-slate-400",
		hint: GLOSSARY.otroSentido,
	},
];

export const ResultPanel = ({ profile }: ResultPanelProps) => {
	const values = profile.resultCounts;
	const total = SERIES.reduce((sum, series) => sum + values[series.key], 0);
	const agg = profile.aggregates;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Resultados observables</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{total > 0 ? (
					<div className="flex h-8 w-full overflow-hidden rounded-md">
						{SERIES.map((series) => {
							const value = values[series.key];
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
						No hay sentidos registrados en providencias.
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
								<MetricHint hint={series.hint}>{series.label}</MetricHint>
							</span>
							<span className="tabular-nums text-muted-foreground">
								{values[series.key]}
							</span>
						</li>
					))}
				</ul>
				<dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
					{(
						[
							["Sentencias", agg.sentencias, GLOSSARY.sentencias],
							["Autos", agg.autos, GLOSSARY.autos],
							["Tutelas", agg.tutelas, GLOSSARY.tutelas],
							["% favorable", agg.pctFavorable ?? "—", GLOSSARY.pctFavorable],
							[
								"Dur. prom. (años)",
								agg.durPromAnios ?? "—",
								GLOSSARY.durPromAnios,
							],
							[
								"Salvamentos rec.",
								agg.salvamentosRecibidos,
								GLOSSARY.salvamentosRecibidos,
							],
						] as const
					).map(([label, value, hint]) => (
						<div key={label} className="rounded-md border px-3 py-2">
							<dt className="text-xs text-muted-foreground">
								<MetricHint hint={hint}>{label}</MetricHint>
							</dt>
							<dd className="tabular-nums font-medium">{value}</dd>
						</div>
					))}
				</dl>
				<dl className="grid grid-cols-3 gap-2 text-sm">
					<div className="rounded-md border px-3 py-2">
						<dt className="text-xs text-muted-foreground">
							<MetricHint hint={GLOSSARY.tasaFavorableCiudadano}>
								Tasa ciudadano (perfil)
							</MetricHint>
						</dt>
						<dd className="tabular-nums font-medium">
							{profile.tasaFavorableCiudadano ?? "—"}
						</dd>
					</div>
					<div className="rounded-md border px-3 py-2">
						<dt className="text-xs text-muted-foreground">
							<MetricHint hint={GLOSSARY.tasaFavorableEstado}>
								Tasa Estado (perfil)
							</MetricHint>
						</dt>
						<dd className="tabular-nums font-medium">
							{profile.tasaFavorableEstado ?? "—"}
						</dd>
					</div>
					<div className="rounded-md border px-3 py-2">
						<dt className="text-xs text-muted-foreground">
							<MetricHint hint={GLOSSARY.tasaMixto}>
								Tasa mixto (perfil)
							</MetricHint>
						</dt>
						<dd className="tabular-nums font-medium">
							{profile.tasaMixto ?? "—"}
						</dd>
					</div>
				</dl>
				<p className="text-xs text-muted-foreground">
					Las tasas del perfil son cualitativas (ciudadano / Estado / mixto). La
					barra superior cuenta el sentido registrado en providencias scrapadas.
				</p>
				<Alert>
					<AlertTitle>Aviso</AlertTitle>
					<AlertDescription>{DISCLAIMER}</AlertDescription>
				</Alert>
			</CardContent>
		</Card>
	);
};
