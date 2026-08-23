import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GLOSSARY } from "../glossary";
import type { JudgeListItem } from "../schemas/judge-profile.schema";
import { JudgePortrait } from "./JudgePortrait";
import { MetricHint } from "./MetricHint";

type JudgeRankListProps = {
	jueces: JudgeListItem[];
	emptyMessage: string;
};

const organo = (juez: JudgeListItem) =>
	[juez.seccion, juez.subseccion].filter(Boolean).join(" · ") ||
	juez.sala ||
	"Consejo de Estado";

export const JudgeRankList = ({ jueces, emptyMessage }: JudgeRankListProps) => {
	if (jueces.length === 0) {
		return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
	}

	return (
		<ul className="flex flex-col gap-3">
			{jueces.map((juez, index) => (
				<li key={juez.slug}>
					<Link
						href={`/jueces/${juez.slug}`}
						className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-accent"
					>
						<span className="w-8 text-center text-sm tabular-nums text-muted-foreground">
							{index + 1}
						</span>
						<span className="relative size-14 shrink-0">
							<JudgePortrait
								name={juez.ponente}
								initials={juez.initials}
								photoUrl={juez.photoUrl}
								size="sm"
							/>
							<MetricHint
								hint={GLOSSARY.overall}
								className="absolute -right-1 -bottom-1"
							>
								<span className="flex size-6 items-center justify-center rounded-md bg-foreground text-xs font-bold tabular-nums text-background">
									{juez.overall}
								</span>
							</MetricHint>
						</span>
						<span className="min-w-0 flex-1">
							<span className="block font-medium tracking-tight">
								{juez.ponente}
							</span>
							<span className="mt-1 block text-sm text-muted-foreground">
								{organo(juez)} · {juez.totalCasos} casos
							</span>
							<span className="mt-2 flex flex-wrap gap-1.5">
								{juez.tendencia ? (
									<MetricHint hint={GLOSSARY.tendencia}>
										<Badge className="font-normal">{juez.tendencia}</Badge>
									</MetricHint>
								) : null}
								{juez.favoreceA ? (
									<MetricHint hint={GLOSSARY.favoreceA}>
										<Badge variant="outline" className="font-normal">
											Favorece a {juez.favoreceA}
										</Badge>
									</MetricHint>
								) : null}
							</span>
						</span>
					</Link>
				</li>
			))}
		</ul>
	);
};
