import Link from "next/link";
import { getNeighborSlugs, getVariant } from "../data/variants";

type Props = {
	slug: string;
};

export const VariantNav = ({ slug }: Props) => {
	const meta = getVariant(slug);
	const neighbors = getNeighborSlugs(slug);
	if (!meta) {
		return null;
	}

	return (
		<div className="fixed right-3 bottom-3 z-50 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-2 rounded-full border border-black/15 bg-white/90 px-3 py-2 text-xs text-neutral-800 shadow-lg backdrop-blur">
			<Link
				href="/variantes"
				className="font-medium underline-offset-2 hover:underline"
			>
				Índice
			</Link>
			<span className="text-neutral-400">·</span>
			<span>
				{meta.number} {meta.title}
			</span>
			<Link
				href={`/variantes/${neighbors.prev}`}
				className="rounded-full px-2 py-1 hover:bg-black/5"
			>
				←
			</Link>
			<Link
				href={`/variantes/${neighbors.next}`}
				className="rounded-full px-2 py-1 hover:bg-black/5"
			>
				→
			</Link>
		</div>
	);
};
