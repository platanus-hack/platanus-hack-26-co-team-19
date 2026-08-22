import Link from "next/link";
import { VariantNav } from "../components/VariantNav";
import { sampleLawyers, siteCopy, stats } from "../data/copy";

export default function FirmaBoutiqueLanding() {
	return (
		<div className="min-h-svh bg-[#f6f1e6] text-[#0c1a33]">
			<VariantNav slug="firma-boutique" />
			<div className="mx-auto max-w-3xl px-6 py-16 text-center">
				<p className="text-[10px] tracking-[0.5em] text-[#b0893e] uppercase">
					Estudio
				</p>
				<div className="mx-auto mt-6 h-px w-24 bg-[#b0893e]" />
				<p className="mt-6 font-[family-name:var(--font-variant-serif)] text-5xl">
					{siteCopy.brand}
				</p>
				<nav className="mt-8 flex justify-center gap-8 text-xs tracking-[0.25em] uppercase">
					<Link href="/abogados">Directorio</Link>
					<Link href="/sign-in">Ingreso</Link>
				</nav>
				<h1 className="mt-16 font-[family-name:var(--font-variant-serif)] text-4xl leading-snug sm:text-5xl">
					{siteCopy.headline}
				</h1>
				<p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-[#3b4660]">
					{siteCopy.lead}
				</p>
				<div className="mt-10 flex justify-center gap-4">
					<Link
						href="/abogados"
						className="border border-[#b0893e] bg-[#0c1a33] px-8 py-3 text-xs tracking-[0.2em] text-[#f6f1e6] uppercase"
					>
						{siteCopy.ctaPrimary}
					</Link>
					<Link
						href="/sign-in"
						className="border border-[#b0893e] px-8 py-3 text-xs tracking-[0.2em] uppercase"
					>
						{siteCopy.ctaSecondary}
					</Link>
				</div>
			</div>
			<section className="border-y border-[#b0893e]/40 bg-[#0c1a33] text-[#f6f1e6]">
				<div className="mx-auto grid max-w-4xl gap-10 px-6 py-16 md:grid-cols-3">
					{[
						[siteCopy.privacyTitle, siteCopy.privacy],
						[siteCopy.trustTitle, siteCopy.trust],
						[siteCopy.hierarchyTitle, siteCopy.hierarchy],
					].map(([title, body]) => (
						<article key={title}>
							<div className="mx-auto mb-4 h-px w-8 bg-[#b0893e]" />
							<h2 className="font-[family-name:var(--font-variant-serif)] text-xl">
								{title}
							</h2>
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
						<p className="font-[family-name:var(--font-variant-serif)] text-3xl text-[#b0893e]">
							{item.value}
						</p>
						<p className="mt-2 text-[10px] tracking-[0.2em] uppercase">
							{item.label}
						</p>
					</div>
				))}
			</section>
			<ul className="mx-auto max-w-2xl space-y-4 px-6 pb-20">
				{sampleLawyers.map((lawyer) => (
					<li key={lawyer.slug} className="border border-[#b0893e]/50">
						<Link
							href={`/abogados/${lawyer.slug}`}
							className="block px-6 py-5 text-center"
						>
							<p className="font-[family-name:var(--font-variant-serif)] text-xl">
								{lawyer.name}
							</p>
							<p className="mt-1 text-xs tracking-[0.2em] text-[#b0893e] uppercase">
								{lawyer.materia} · {lawyer.sede}
							</p>
						</Link>
					</li>
				))}
			</ul>
			<footer className="pb-12 text-center text-[10px] tracking-[0.25em] uppercase text-[#b0893e]">
				{siteCopy.footer}
			</footer>
		</div>
	);
}
