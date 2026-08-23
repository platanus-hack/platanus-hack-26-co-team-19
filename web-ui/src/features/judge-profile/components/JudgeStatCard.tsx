import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GLOSSARY } from "../glossary";
import { parseTiposProceso } from "../parse-tipos-proceso";
import type { JudgePublicProfile } from "../schemas/judge-profile.schema";
import { JudgePortrait } from "./JudgePortrait";
import { MetricHint } from "./MetricHint";
import { ScoreRadarChart } from "./ScoreRadarChart";

type JudgeStatCardProps = {
	profile: JudgePublicProfile;
};

const organo = (profile: JudgePublicProfile) =>
	[profile.sala, profile.seccion, profile.subseccion]
		.filter(Boolean)
		.join(" · ");

export const JudgeStatCard = ({ profile }: JudgeStatCardProps) => {
	return (
		<Card>
			<CardHeader className="gap-4">
				<div className="flex items-start gap-4">
					<div className="relative size-16 shrink-0 sm:size-20">
						<JudgePortrait
							name={profile.ponente}
							initials={profile.initials}
							photoUrl={profile.photoUrl}
							size="lg"
						/>
						<MetricHint
							hint={GLOSSARY.overall}
							className="absolute -right-1 -bottom-1"
						>
							<span className="flex size-8 items-center justify-center rounded-md bg-foreground text-sm font-bold tabular-nums text-background">
								{profile.overall}
							</span>
						</MetricHint>
					</div>
					<div className="min-w-0">
						<CardTitle className="text-xl sm:text-2xl">
							{profile.ponente}
						</CardTitle>
						<p className="mt-1 text-sm text-muted-foreground">
							{organo(profile) || "Consejo de Estado"}
						</p>
						<p className="text-sm text-muted-foreground">
							{profile.totalCasos} casos en ficha · {profile.aggregates.total}{" "}
							providencias observadas
						</p>
					</div>
				</div>
				<div className="flex flex-wrap gap-2">
					{profile.tendencia ? (
						<MetricHint hint={GLOSSARY.tendencia}>
							<Badge>{profile.tendencia}</Badge>
						</MetricHint>
					) : null}
					{profile.favoreceA ? (
						<MetricHint hint={GLOSSARY.favoreceA}>
							<Badge variant="outline">Favorece a {profile.favoreceA}</Badge>
						</MetricHint>
					) : null}
					{parseTiposProceso(profile.tiposProcesoFrecuentes).map((tipo) => (
						<MetricHint key={tipo} hint={GLOSSARY.tiposProceso}>
							<Badge variant="outline">{tipo}</Badge>
						</MetricHint>
					))}
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<p className="text-xs text-muted-foreground">
					Retrato ilustrativo generado. No es fotografía del magistrado.
				</p>
				<p className="text-xs text-muted-foreground">
					Puntajes 0–100 del perfil cualitativo. No es calificación oficial ni
					tasa de éxito.
				</p>
				<ScoreRadarChart scores={profile.scores} />
			</CardContent>
		</Card>
	);
};
