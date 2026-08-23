"use client";

import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
} from "recharts";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { GLOSSARY } from "../glossary";
import { type JudgeScore, SCORE_LABELS } from "../schemas/judge-profile.schema";
import { MetricHint } from "./MetricHint";

type ScoreRadarChartProps = {
	scores: JudgeScore;
};

const KEYS = [
	"garantismo",
	"rigurosidad",
	"independencia",
	"consistencia",
	"profundidadJuridica",
] as const;

const SHORT: Record<(typeof KEYS)[number], string> = {
	garantismo: "Garantismo",
	rigurosidad: "Rigor",
	independencia: "Independ.",
	consistencia: "Consist.",
	profundidadJuridica: "Profund.",
};

const chartConfig = {
	valor: { label: "Puntaje", color: "var(--foreground)" },
} satisfies ChartConfig;

export const ScoreRadarChart = ({ scores }: ScoreRadarChartProps) => {
	const data = KEYS.map((key) => ({
		eje: SHORT[key],
		valor: scores[key] ?? 0,
	}));

	return (
		<div className="flex flex-col gap-3">
			<ChartContainer
				config={chartConfig}
				className="mx-auto aspect-square w-full max-w-sm"
				initialDimension={{ width: 280, height: 280 }}
			>
				<RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
					<PolarGrid gridType="polygon" />
					<PolarAngleAxis dataKey="eje" tick={{ fontSize: 11 }} />
					<PolarRadiusAxis
						angle={90}
						domain={[0, 100]}
						tick={false}
						axisLine={false}
					/>
					<Radar
						dataKey="valor"
						fill="var(--color-valor)"
						fillOpacity={0.25}
						stroke="var(--color-valor)"
						strokeWidth={2}
					/>
				</RadarChart>
			</ChartContainer>
			<dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
				{KEYS.map((key) => (
					<div
						key={key}
						className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
					>
						<dt className="text-muted-foreground">
							<MetricHint hint={GLOSSARY[key]}>{SCORE_LABELS[key]}</MetricHint>
						</dt>
						<dd className="tabular-nums font-medium">{scores[key] ?? "—"}</dd>
					</div>
				))}
			</dl>
		</div>
	);
};
