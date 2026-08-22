import Image from "next/image";
import Link from "next/link";
import type { LawyerPublicProfile } from "../schemas/lawyer-profile.schema";
import { MATERIA_LABELS } from "../schemas/lawyer-profile.schema";

type LawyerRankListProps = {
	lawyers: LawyerPublicProfile[];
	emptyMessage: string;
};

export const LawyerRankList = ({
	lawyers,
	emptyMessage,
}: LawyerRankListProps) => {
	if (lawyers.length === 0) {
		return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
	}

	return (
		<ul className="flex flex-col gap-3">
			{lawyers.map((lawyer, index) => (
				<li key={lawyer.slug}>
					<Link
						href={`/abogados/${lawyer.slug}`}
						className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-accent"
					>
						<span className="w-8 text-center text-sm tabular-nums text-muted-foreground">
							{index + 1}
						</span>
						<span className="relative size-14 shrink-0">
							<Image
								src={lawyer.identity.photoUrl}
								alt=""
								width={56}
								height={56}
								className="size-14 rounded-full object-cover"
							/>
							<span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-md bg-foreground text-xs font-bold tabular-nums text-background">
								{lawyer.ratings.overall}
							</span>
						</span>
						<span className="min-w-0 flex-1">
							<span className="block font-medium tracking-tight">
								{lawyer.identity.fullName}
							</span>
							<span className="mt-1 block text-sm text-muted-foreground">
								{MATERIA_LABELS[lawyer.materiaPrincipal]} ·{" "}
								{lawyer.identity.colegioAbogados} · {lawyer.identity.sede}
							</span>
						</span>
					</Link>
				</li>
			))}
		</ul>
	);
};
