import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GLOSSARY } from "../glossary";
import type { JudgePublicProfile } from "../schemas/judge-profile.schema";
import { MetricHint } from "./MetricHint";

type LecturaPanelProps = {
	profile: JudgePublicProfile;
};

const Block = ({
	title,
	body,
	hint,
}: {
	title: string;
	body: string;
	hint: string;
}) => (
	<div>
		<h3 className="text-sm font-medium">
			<MetricHint hint={hint}>{title}</MetricHint>
		</h3>
		<p className="mt-1 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
			{body}
		</p>
	</div>
);

export const LecturaPanel = ({ profile }: LecturaPanelProps) => {
	const resumen = profile.resumen?.trim();
	const blocks = [
		{
			title: "Patrón de argumentación",
			body: profile.patronArgumentacion,
			hint: GLOSSARY.patronArgumentacion,
		},
		{
			title: "Sesgo observable",
			body: profile.sesgoObservable,
			hint: GLOSSARY.sesgoObservable,
		},
		{
			title: "A favor de",
			body: profile.aFavorDe,
			hint: GLOSSARY.aFavorDe,
		},
		{
			title: "Inclinado a",
			body: profile.inclinadoA,
			hint: GLOSSARY.inclinadoA,
		},
	].filter((block) => Boolean(block.body?.trim()));

	if (!resumen && blocks.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">
				Aún no hay lectura cualitativa para este ponente.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{resumen ? (
				<Card>
					<CardHeader>
						<CardTitle>
							<MetricHint hint={GLOSSARY.resumen}>Resumen</MetricHint>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm leading-relaxed whitespace-pre-wrap">
							{resumen}
						</p>
					</CardContent>
				</Card>
			) : null}
			{blocks.length > 0 ? (
				<Card>
					<CardHeader>
						<CardTitle>Lectura táctica</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{blocks.map((block) => (
							<Block
								key={block.title}
								title={block.title}
								hint={block.hint}
								body={block.body?.trim() ?? ""}
							/>
						))}
					</CardContent>
				</Card>
			) : null}
		</div>
	);
};
