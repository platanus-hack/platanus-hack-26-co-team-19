import { ContactForm } from "../components/ContactForm";
import { MarketingNavbar } from "../components/MarketingNavbar";

export default function ContactView() {
	return (
		<div className="flex min-h-svh flex-col">
			<MarketingNavbar />
			<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16">
				<div className="grid gap-10 lg:grid-cols-2">
					<div>
						<p className="text-sm text-muted-foreground">Contact</p>
						<h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
							Get in touch
						</h1>
						<p className="mt-4 text-muted-foreground leading-relaxed">
							Placeholder contact page. Submissions are stored so you can review
							them later from the dashboard.
						</p>
					</div>
					<div className="rounded-lg border p-6">
						<ContactForm />
					</div>
				</div>
			</main>
			<footer className="border-t py-6 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} Acme Inc. All rights reserved.
			</footer>
		</div>
	);
}
