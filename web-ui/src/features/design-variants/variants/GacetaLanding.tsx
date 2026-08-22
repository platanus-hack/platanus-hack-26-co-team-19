import Link from "next/link";
import { VariantNav } from "../components/VariantNav";
import { sampleLawyers, siteCopy, stats } from "../data/copy";

export default function GacetaLanding() {
	return (
		<div className="min-h-svh bg-[#f4f1e8] text-[#111]">
			<VariantNav slug="gaceta" />
			<header className="border-b-4 border-black px-4 pt-6">
				<div className="mx-auto max-w-5xl">
					<div className="flex items-end justify-between gap-4 border-b border-black pb-3">
						<p className="text-[10px] tracking-[0.3em] uppercase">
							Edición de observación
						</p>
						<p className="text-[10px] tracking-[0.3em] uppercase">Lima</p>
					</div>
					<h1 className="py-4 text-center font-[family-name:var(--font-variant-serif)] text-6xl tracking-tight sm:text-7xl">
						{siteCopy.brand}
					</h1>
					<p className="border-y-2 border-black py-2 text-center text-xs tracking-[0.35em] uppercase">
						{siteCopy.kicker} — sin tasas de éxito — sin rumor
					</p>
				</div>
			</header>
			<main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-12">
				<article className="md:col-span-8">
					<h2 className="font-[family-name:var(--font-variant-serif)] text-4xl leading-tight">
						{siteCopy.headline}
					</h2>
					<p className="mt-4 columns-1 text-sm leading-6 sm:columns-2 sm:gap-8">
						{siteCopy.lead} {siteCopy.privacy} {siteCopy.trust}{" "}
						{siteCopy.hierarchy}
					</p>
					<div className="mt-8 flex gap-4 text-xs uppercase tracking-widest">
						<Link href="/abogados" className="bg-black px-4 py-2 text-white">
							{siteCopy.ctaPrimary}
						</Link>
						<Link href="/sign-in" className="border border-black px-4 py-2">
							{siteCopy.ctaSecondary}
						</Link>
					</div>
				</article>
				<aside className="border-t border-black pt-4 md:col-span-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
					<p className="text-[10px] font-bold tracking-[0.2em] uppercase">
						Cifras de la edición
					</p>
					<ul className="mt-4 space-y-4">
						{stats.map((item) => (
							<li key={item.label} className="border-b border-black/20 pb-3">
								<p className="font-[family-name:var(--font-variant-serif)] text-3xl">
									{item.value}
								</p>
								<p className="text-xs uppercase">{item.label}</p>
								<p className="text-[11px] text-neutral-600">{item.hint}</p>
							</li>
						))}
					</ul>
				</aside>
				<section className="md:col-span-12">
					<p className="border-b-2 border-black pb-2 text-[10px] tracking-[0.3em] uppercase">
						Fichas en esta página
					</p>
					<div className="mt-4 grid gap-6 md:grid-cols-3">
						{sampleLawyers.map((lawyer) => (
							<Link
								key={lawyer.slug}
								href={`/abogados/${lawyer.slug}`}
								className="block"
							>
								<p className="text-[10px] uppercase tracking-widest">
									{lawyer.materia}
								</p>
								<p className="mt-1 font-[family-name:var(--font-variant-serif)] text-2xl leading-tight">
									{lawyer.name}
								</p>
								<p className="mt-2 text-xs">
									{lawyer.sede} · {lawyer.colegio}
								</p>
							</Link>
						))}
					</div>
				</section>
			</main>
			<footer className="border-t-4 border-black py-4 text-center text-[10px] tracking-[0.2em] uppercase">
				{siteCopy.footer}
			</footer>
		</div>
	);
}
