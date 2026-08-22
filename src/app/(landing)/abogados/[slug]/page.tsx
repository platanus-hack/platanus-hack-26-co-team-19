import { notFound } from "next/navigation";
import { getLawyerBySlug } from "@/features/lawyer-profile/data/lawyers";
import LawyerProfileView from "@/features/lawyer-profile/views/LawyerProfileView";

type LawyerDetailPageProps = {
	params: Promise<{ slug: string }>;
};

export default async function LawyerDetailPage({
	params,
}: LawyerDetailPageProps) {
	const { slug } = await params;
	const profile = getLawyerBySlug(slug);
	if (!profile) notFound();
	return <LawyerProfileView profile={profile} />;
}
