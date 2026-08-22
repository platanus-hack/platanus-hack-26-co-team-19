import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateProfileFormatter } from "@/features/shared/date/date-formatter";
import type { DataQuality } from "../schemas/lawyer-profile.schema";

type DataQualityPanelProps = {
	dataQuality: DataQuality;
};

const METRICS = [
	{ key: "overallConfidence" as const, label: "Confianza general" },
	{ key: "identityConfidence" as const, label: "Identidad" },
	{ key: "caseAssociationConfidence" as const, label: "Asociación de casos" },
	{
		key: "practiceAreaClassificationConfidence" as const,
		label: "Clasificación de materia",
	},
	{
		key: "outcomeExtractionConfidence" as const,
		label: "Extracción de resultados",
	},
];

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export const DataQualityPanel = ({ dataQuality }: DataQualityPanelProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Calidad de datos</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<ul className="flex flex-col gap-2">
					{METRICS.map((metric) => (
						<li
							key={metric.key}
							className="flex items-center justify-between gap-3 text-sm"
						>
							<span>{metric.label}</span>
							<span className="tabular-nums text-muted-foreground">
								{formatPercent(dataQuality[metric.key])}
							</span>
						</li>
					))}
				</ul>
				<p className="text-sm text-muted-foreground">
					Última revisión humana:{" "}
					<DateProfileFormatter
						date={new Date(dataQuality.lastHumanReviewAt)}
					/>
				</p>
				{dataQuality.needsHumanReview ? (
					<Alert>
						<AlertTitle>Revisión humana pendiente</AlertTitle>
						<AlertDescription>
							Este perfil requiere una revisión humana adicional de la calidad
							de los datos.
						</AlertDescription>
					</Alert>
				) : null}
			</CardContent>
		</Card>
	);
};
