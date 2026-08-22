import { MarketingNavbar } from "../components/MarketingNavbar";

export default function AboutView() {
	return (
		<div className="flex min-h-svh flex-col">
			<MarketingNavbar />
			<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16">
				<p className="text-sm text-muted-foreground">About</p>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
					About this template
				</h1>
				<p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
					This is a placeholder about page. Use it to introduce your product,
					team, or mission. The layout is intentionally minimal so you can
					replace it with project-specific content later.
				</p>
				<div className="mt-10 grid gap-6 sm:grid-cols-3">
					{["Mission", "Product", "Team"].map((title) => (
						<div key={title} className="rounded-lg border p-5">
							<h2 className="font-medium">{title}</h2>
							<p className="mt-2 text-sm text-muted-foreground">
								Placeholder section for {title.toLowerCase()} details.
							</p>
						</div>
					))}
				</div>
			</main>
			<footer className="border-t py-6 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} Acme Inc. All rights reserved.
			</footer>
		</div>
	);
}
