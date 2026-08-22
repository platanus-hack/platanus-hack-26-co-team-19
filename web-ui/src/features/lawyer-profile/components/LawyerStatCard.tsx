import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LawyerPublicProfile } from "../schemas/lawyer-profile.schema";
import { MATERIA_LABELS } from "../schemas/lawyer-profile.schema";
import { AttributeHexChart } from "./AttributeHexChart";

type LawyerStatCardProps = {
	profile: LawyerPublicProfile;
};

export const LawyerStatCard = ({ profile }: LawyerStatCardProps) => {
	const { identity, ratings, materiaPrincipal, materias } = profile;

	return (
		<Card>
			<CardHeader className="gap-4">
				<div className="flex items-start gap-4">
					<div className="relative size-16 shrink-0 sm:size-20">
						<Image
							src={identity.photoUrl}
							alt={`Retrato de ${identity.fullName}`}
							width={80}
							height={80}
							className="size-16 rounded-xl object-cover sm:size-20"
						/>
						<span className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-md bg-foreground text-sm font-bold tabular-nums text-background">
							{ratings.overall}
						</span>
					</div>
					<div className="min-w-0">
						<CardTitle className="text-xl sm:text-2xl">
							{identity.fullName}
						</CardTitle>
						<p className="mt-1 text-sm text-muted-foreground">
							{identity.nroColegiatura} · {identity.colegioAbogados}
						</p>
						<p className="text-sm text-muted-foreground">
							{identity.sede} · Distrito judicial {identity.distritoJudicial} ·{" "}
							{identity.aniosObservados} años observados
						</p>
					</div>
				</div>
				<div className="flex flex-wrap gap-2">
					<Badge>{MATERIA_LABELS[materiaPrincipal]}</Badge>
					{materias
						.filter((materia) => materia !== materiaPrincipal)
						.map((materia) => (
							<Badge key={materia} variant="outline">
								{MATERIA_LABELS[materia]}
							</Badge>
						))}
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<p className="text-xs text-muted-foreground">
					Rating ilustrativo (1–99), no es una calificación colegial ni una tasa
					de éxito.
				</p>
				<AttributeHexChart attributes={ratings.attributes} />
			</CardContent>
		</Card>
	);
};
