import { notFound } from "next/navigation";
import { variants } from "@/features/design-variants/data/variants";
import {
	type VariantSlug,
	variantLandings,
} from "@/features/design-variants/variants/registry";

type Props = {
	params: Promise<{ slug: string }>;
};

export const generateStaticParams = () =>
	variants.map((item) => ({ slug: item.slug }));

export default async function VariantePage({ params }: Props) {
	const { slug } = await params;
	const Landing = variantLandings[slug as VariantSlug];
	if (!Landing) {
		notFound();
	}
	return <Landing />;
}
