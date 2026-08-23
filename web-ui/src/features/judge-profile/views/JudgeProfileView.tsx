import Link from "next/link";
import { MarketingNavbar } from "@/features/marketing/components/MarketingNavbar";
import { JudgeProfileTabs } from "../components/JudgeProfileTabs";
import { JudgeStatCard } from "../components/JudgeStatCard";
import type { JudgePublicProfile } from "../schemas/judge-profile.schema";

type JudgeProfileViewProps = {
	profile: JudgePublicProfile;
};

export default function JudgeProfileView({ profile }: JudgeProfileViewProps) {
	return (
		<div className="flex min-h-svh flex-col">
			<MarketingNavbar />
			<main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:py-16">
				<p className="text-sm">
					<Link
						href="/jueces"
						className="text-muted-foreground hover:text-foreground"
					>
						← Buscar jueces
					</Link>
				</p>
				<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(16rem,2fr)_minmax(0,3fr)]">
					<JudgeStatCard profile={profile} />
					<JudgeProfileTabs profile={profile} />
				</div>
			</main>
			<footer className="border-t py-6 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} deley.com. Todos los derechos reservados.
			</footer>
		</div>
	);
}
