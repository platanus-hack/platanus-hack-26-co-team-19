import Link from "next/link";
import type { JudgeListItem } from "@/features/judge-profile/schemas/judge-profile.schema";
import { siteCopy } from "@/features/marketing/data/copy";
import { MarketingNavbar } from "../components/MarketingNavbar";

type LandingViewProps = {
	sampleJueces: JudgeListItem[];
	judgeCount: number;
};

export default function LandingView({
	sampleJueces,
	judgeCount,
}: LandingViewProps) {
	const stats = [
		{ value: String(judgeCount), label: "ponentes" },
		{ value: "corte", label: "schema Postgres" },
		{ value: "0", label: "tasas de éxito" },
		{ value: "100%", label: "disclaimer" },
	] as const;

	return (
		<div className="flex min-h-svh flex-col bg-background text-foreground">
			<MarketingNavbar />
			<div className="mx-auto max-w-3xl px-6 py-16 text-center">
				<p className="text-[10px] tracking-[0.5em] text-accent uppercase">
					Estudio
				</p>
				<div className="mx-auto mt-6 h-px w-24 bg-accent" />
				<p className="mt-6 font-serif text-5xl">{siteCopy.brand}</p>
				<nav className="mt-8 flex justify-center gap-8 text-xs tracking-[0.25em] uppercase">
					<Link href="/jueces">Directorio</Link>
					<Link href="/sign-in">Ingreso</Link>
				</nav>
				<h1 className="mt-16 font-serif text-4xl leading-snug font-normal sm:text-5xl">
					{siteCopy.headline}
				</h1>
				<p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-muted-foreground">
					{siteCopy.lead}
				</p>
				<div className="mt-10 flex justify-center gap-4">
					<Link
						href="/jueces"
						className="border border-accent bg-primary px-8 py-3 text-xs tracking-[0.2em] text-primary-foreground uppercase"
					>
						{siteCopy.ctaPrimary}
					</Link>
					<Link
						href="/sign-in"
						className="border border-accent px-8 py-3 text-xs tracking-[0.2em] uppercase"
					>
						{siteCopy.ctaSecondary}
					</Link>
				</div>
			</div>
			<section className="border-y border-accent/40 bg-primary text-primary-foreground">
				<div className="mx-auto grid max-w-4xl gap-10 px-6 py-16 md:grid-cols-3">
					{[
						[siteCopy.privacyTitle, siteCopy.privacy],
						[siteCopy.trustTitle, siteCopy.trust],
						[siteCopy.hierarchyTitle, siteCopy.hierarchy],
					].map(([title, body]) => (
						<article key={title}>
							<div className="mx-auto mb-4 h-px w-8 bg-accent" />
							<h2 className="font-serif text-xl font-normal">{title}</h2>
							<p className="mt-3 text-sm leading-relaxed text-[#d5d0c4]">
								{body}
							</p>
						</article>
					))}
				</div>
			</section>
			<section className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 py-16 sm:grid-cols-4">
				{stats.map((item) => (
					<div key={item.label} className="text-center">
						<p className="font-serif text-3xl text-accent">{item.value}</p>
						<p className="mt-2 text-[10px] tracking-[0.2em] uppercase">
							{item.label}
						</p>
					</div>
				))}
			</section>
			<ul className="mx-auto max-w-2xl space-y-4 px-6 pb-20">
				{sampleJueces.map((juez) => (
					<li key={juez.slug} className="border border-accent/50">
						<Link
							href={`/jueces/${juez.slug}`}
							className="block px-6 py-5 text-center"
						>
							<p className="font-serif text-xl">{juez.ponente}</p>
							<p className="mt-1 text-xs tracking-[0.2em] text-accent uppercase">
								{[juez.seccion, juez.subseccion].filter(Boolean).join(" · ") ||
									"Consejo de Estado"}
							</p>
						</Link>
					</li>
				))}
			</ul>
			<footer className="pb-12 text-center text-[10px] tracking-[0.25em] text-accent uppercase">
				{siteCopy.footer}
			</footer>
		</div>
	);
}
