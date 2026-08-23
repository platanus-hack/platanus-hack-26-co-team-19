import { ContactForm } from "../components/ContactForm";
import { MarketingNavbar } from "../components/MarketingNavbar";
import { siteCopy } from "../data/copy";

export default function ContactView() {
	return (
		<div className="flex min-h-svh flex-col">
			<MarketingNavbar />
			<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16">
				<div className="grid gap-10 lg:grid-cols-2">
					<div>
						<p className="text-sm text-muted-foreground">
							{siteCopy.contactKicker}
						</p>
						<h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
							{siteCopy.contactTitle}
						</h1>
						<p className="mt-4 text-muted-foreground leading-relaxed">
							{siteCopy.contactLead}
						</p>
					</div>
					<div className="rounded-lg border p-6">
						<ContactForm />
					</div>
				</div>
			</main>
			<footer className="border-t py-6 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} {siteCopy.brand}. {siteCopy.footer}
			</footer>
		</div>
	);
}
