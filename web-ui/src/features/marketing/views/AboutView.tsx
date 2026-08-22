import { MarketingNavbar } from "../components/MarketingNavbar";
import { siteCopy } from "../data/copy";

const sections = [
	{
		title: siteCopy.aboutMissionTitle,
		body: siteCopy.aboutMission,
	},
	{
		title: siteCopy.aboutProductTitle,
		body: siteCopy.aboutProduct,
	},
	{
		title: siteCopy.aboutTeamTitle,
		body: siteCopy.aboutTeam,
	},
] as const;

export default function AboutView() {
	return (
		<div className="flex min-h-svh flex-col">
			<MarketingNavbar />
			<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16">
				<p className="text-sm text-muted-foreground">{siteCopy.aboutKicker}</p>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
					{siteCopy.aboutTitle}
				</h1>
				<p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
					{siteCopy.aboutLead}
				</p>
				<div className="mt-10 grid gap-6 sm:grid-cols-3">
					{sections.map((section) => (
						<div key={section.title} className="rounded-lg border p-5">
							<h2 className="font-medium">{section.title}</h2>
							<p className="mt-2 text-sm text-muted-foreground">
								{section.body}
							</p>
						</div>
					))}
				</div>
			</main>
			<footer className="border-t py-6 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} {siteCopy.brand}. {siteCopy.footer}
			</footer>
		</div>
	);
}
