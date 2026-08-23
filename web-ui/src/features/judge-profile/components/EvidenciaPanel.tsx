import type { JudgePublicProfile } from "../schemas/judge-profile.schema";
import { FundamentosPanel } from "./FundamentosPanel";
import { ProvidenciaHistory } from "./ProvidenciaHistory";
import { VotosFirmasPanel } from "./VotosFirmasPanel";

type EvidenciaPanelProps = {
	profile: JudgePublicProfile;
};

export const EvidenciaPanel = ({ profile }: EvidenciaPanelProps) => {
	const hasProvidencias = profile.providencias.length > 0;
	const hasVotos = profile.votos.length > 0;
	const hasFirmantes = profile.firmantes.length > 0;
	const hasProblemas = profile.problemas.length > 0;
	const hasDescriptores = profile.descriptores.length > 0;

	if (
		!hasProvidencias &&
		!hasVotos &&
		!hasFirmantes &&
		!hasProblemas &&
		!hasDescriptores
	) {
		return (
			<p className="text-sm text-muted-foreground">
				No hay providencias, votos ni fundamentos asociados a este ponente.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-8">
			<ProvidenciaHistory items={profile.providencias} />
			<VotosFirmasPanel profile={profile} />
			<FundamentosPanel profile={profile} />
		</div>
	);
};
