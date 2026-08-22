"use client";

import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
} from "recharts";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
	ATTRIBUTE_LABELS,
	type LawyerAttributes,
} from "../schemas/lawyer-profile.schema";

type AttributeHexChartProps = {
	attributes: LawyerAttributes;
};

const HEX_KEYS = [
	"litigacionOral",
	"escritos",
	"recursosInstancias",
	"conciliacion",
	"prueba",
	"procedimiento",
] as const;

const HEX_SHORT: Record<(typeof HEX_KEYS)[number], string> = {
	litigacionOral: "Oral",
	escritos: "Escritos",
	recursosInstancias: "Recursos",
	conciliacion: "Conciliación",
	prueba: "Prueba",
	procedimiento: "Procedimiento",
};

const EXTRA_KEYS = ["derechoMaterial", "especializacion"] as const;

const chartConfig = {
	valor: { label: "Capacidad", color: "var(--foreground)" },
} satisfies ChartConfig;

export const AttributeHexChart = ({ attributes }: AttributeHexChartProps) => {
	const data = HEX_KEYS.map((key) => ({
		eje: HEX_SHORT[key],
		valor: attributes[key],
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
						domain={[40, 99]}
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
			<dl className="grid grid-cols-2 gap-2 text-sm">
				{EXTRA_KEYS.map((key) => (
					<div
						key={key}
						className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
					>
						<dt className="text-muted-foreground">{ATTRIBUTE_LABELS[key]}</dt>
						<dd className="tabular-nums font-medium">{attributes[key]}</dd>
					</div>
				))}
			</dl>
		</div>
	);
};
