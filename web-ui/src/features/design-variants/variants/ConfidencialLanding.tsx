import Link from "next/link";
import { VariantNav } from "../components/VariantNav";
import { sampleLawyers, siteCopy, stats } from "../data/copy";

export default function ConfidencialLanding() {
	return (
		<div className="min-h-svh bg-[#e7e4dc] text-[#3f3c36]">
			<VariantNav slug="confidencial" />
			<div
				className="absolute inset-x-0 top-0 h-40 opacity-70"
				style={{
					background:
						"repeating-linear-gradient(90deg, #c5cfc6 0 28px, #d5d2c8 28px 56px)",
				}}
			/>
			<header className="relative mx-auto flex max-w-5xl items-center justify-between px-6 pt-10">
				<p className="rounded-full bg-white/50 px-4 py-2 text-sm backdrop-blur">
					{siteCopy.brand}
				</p>
				<nav className="flex gap-3 text-sm">
					<Link
						href="/abogados"
						className="rounded-full bg-white/40 px-4 py-2 backdrop-blur"
					>
						Directorio
					</Link>
					<Link
						href="/sign-in"
						className="rounded-full bg-white/40 px-4 py-2 backdrop-blur"
					>
						Ingreso
					</Link>
				</nav>
			</header>
			<main className="relative mx-auto max-w-5xl px-6 py-20">
				<p className="text-xs tracking-[0.3em] text-[#6f7a70]">
					{siteCopy.kicker}
				</p>
				<h1 className="mt-4 max-w-3xl font-[family-name:var(--font-variant-serif)] text-5xl leading-tight">
					{siteCopy.headline}
				</h1>
				<p className="mt-6 max-w-xl leading-relaxed text-[#5c5a54]">
					{siteCopy.lead}
				</p>
				<div className="mt-8 flex gap-3">
					<Link
						href="/abogados"
						className="rounded-full bg-[#5d6b62] px-6 py-3 text-sm text-[#f4f2ec]"
					>
						{siteCopy.ctaPrimary}
					</Link>
					<Link
						href="/sign-in"
						className="rounded-full border border-[#5d6b62]/40 px-6 py-3 text-sm"
					>
						{siteCopy.ctaSecondary}
					</Link>
				</div>
				<section className="mt-16 grid gap-4 md:grid-cols-3">
					{[
						[siteCopy.privacyTitle, siteCopy.privacy],
						[siteCopy.trustTitle, siteCopy.trust],
						[siteCopy.hierarchyTitle, siteCopy.hierarchy],
					].map(([title, body]) => (
						<article
							key={title}
							className="rounded-3xl border border-white/60 bg-white/35 p-6 shadow-sm backdrop-blur-md"
						>
							<h2 className="font-[family-name:var(--font-variant-serif)] text-xl">
								{title}
							</h2>
							<p className="mt-3 text-sm leading-relaxed">{body}</p>
						</article>
					))}
				</section>
				<section className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
					{stats.map((item) => (
						<div key={item.label} className="rounded-2xl bg-[#d5d2c8]/80 p-5">
							<p className="font-[family-name:var(--font-variant-serif)] text-3xl">
								{item.value}
							</p>
							<p className="mt-1 text-xs">{item.label}</p>
						</div>
					))}
				</section>
				<ul className="mt-12 space-y-3">
					{sampleLawyers.map((lawyer) => (
						<li key={lawyer.slug}>
							<Link
								href={`/abogados/${lawyer.slug}`}
								className="flex items-center justify-between rounded-full bg-white/50 px-6 py-4 backdrop-blur"
							>
								<span>{lawyer.name}</span>
								<span className="text-xs text-[#6f7a70]">{lawyer.materia}</span>
							</Link>
						</li>
					))}
				</ul>
			</main>
			<footer className="px-6 py-10 text-center text-xs text-[#6f7a70]">
				{siteCopy.footer}
			</footer>
		</div>
	);
}
