import Link from "next/link";
import { VariantNav } from "../components/VariantNav";
import { sampleLawyers, siteCopy, stats } from "../data/copy";

export default function MaderaSilencioLanding() {
	return (
		<div className="relative min-h-svh overflow-hidden bg-[#2a1c12] text-[#f0e4d0]">
			<VariantNav slug="madera-silencio" />
			<div
				className="pointer-events-none absolute inset-0 opacity-40"
				style={{
					background:
						"repeating-linear-gradient(90deg, #3d2918 0 18px, #2a1c12 18px 22px, #4a3220 22px 40px, #2a1c12 40px 44px)",
				}}
			/>
			<div className="relative mx-auto max-w-5xl px-8 py-16">
				<p className="text-[11px] tracking-[0.5em] uppercase text-[#d4b896]">
					Aislamiento
				</p>
				<p className="mt-4 font-[family-name:var(--font-variant-serif)] text-6xl leading-none tracking-tight sm:text-7xl">
					{siteCopy.brand}
				</p>
				<nav className="mt-8 flex gap-8 text-sm text-[#d4b896]">
					<Link href="/abogados">Directorio</Link>
					<Link href="/sign-in">Ingreso</Link>
				</nav>
				<h1 className="mt-16 max-w-3xl font-[family-name:var(--font-variant-serif)] text-4xl leading-[1.15] sm:text-5xl">
					{siteCopy.headline}
				</h1>
				<p className="mt-8 max-w-xl text-base leading-7 text-[#e0d0b8]">
					{siteCopy.lead}
				</p>
				<div className="mt-10 flex flex-wrap gap-4">
					<Link
						href="/abogados"
						className="bg-[#f0e4d0] px-6 py-3 text-sm text-[#2a1c12]"
					>
						{siteCopy.ctaPrimary}
					</Link>
					<Link
						href="/sign-in"
						className="border border-[#d4b896] px-6 py-3 text-sm text-[#d4b896]"
					>
						{siteCopy.ctaSecondary}
					</Link>
				</div>
				<section className="mt-20 grid gap-10 md:grid-cols-3">
					{[
						[siteCopy.privacyTitle, siteCopy.privacy],
						[siteCopy.trustTitle, siteCopy.trust],
						[siteCopy.hierarchyTitle, siteCopy.hierarchy],
					].map(([title, body]) => (
						<article key={title} className="border-t border-[#d4b896]/40 pt-5">
							<h2 className="font-[family-name:var(--font-variant-serif)] text-2xl">
								{title}
							</h2>
							<p className="mt-3 text-sm leading-relaxed text-[#dccab0]">
								{body}
							</p>
						</article>
					))}
				</section>
				<section className="mt-16 grid grid-cols-2 gap-y-8 sm:grid-cols-4">
					{stats.map((item) => (
						<div key={item.label}>
							<p className="font-[family-name:var(--font-variant-serif)] text-4xl">
								{item.value}
							</p>
							<p className="mt-1 text-xs tracking-wide text-[#d4b896]">
								{item.label}
							</p>
						</div>
					))}
				</section>
				<ul className="mt-16 divide-y divide-[#d4b896]/25 border-y border-[#d4b896]/25">
					{sampleLawyers.map((lawyer) => (
						<li key={lawyer.slug}>
							<Link
								href={`/abogados/${lawyer.slug}`}
								className="flex flex-wrap items-baseline justify-between gap-2 py-5"
							>
								<span className="font-[family-name:var(--font-variant-serif)] text-2xl">
									{lawyer.name}
								</span>
								<span className="text-sm text-[#d4b896]">
									{lawyer.materia} · {lawyer.sede}
								</span>
							</Link>
						</li>
					))}
				</ul>
				<p className="mt-16 text-xs tracking-[0.2em] uppercase text-[#d4b896]">
					{siteCopy.footer}
				</p>
			</div>
		</div>
	);
}
