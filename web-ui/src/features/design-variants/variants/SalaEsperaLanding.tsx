import Link from "next/link";
import { VariantNav } from "../components/VariantNav";
import { sampleLawyers, siteCopy, stats } from "../data/copy";

export default function SalaEsperaLanding() {
	return (
		<div className="min-h-svh bg-[#f3ead9] text-[#3a2f22]">
			<VariantNav slug="sala-espera" />
			<header className="mx-auto flex w-full max-w-6xl items-end justify-between px-8 pt-10 pb-16">
				<div>
					<p className="text-xs tracking-[0.35em] uppercase text-[#8b7355]">
						Recepción
					</p>
					<p className="mt-2 font-[family-name:var(--font-variant-serif)] text-3xl">
						{siteCopy.brand}
					</p>
				</div>
				<nav className="hidden gap-8 text-sm text-[#6d5c45] sm:flex">
					<Link href="/abogados">Directorio</Link>
					<Link href="/sign-in">Ingreso</Link>
				</nav>
			</header>
			<main>
				<section className="mx-auto grid max-w-6xl gap-16 px-8 pb-24 lg:grid-cols-[1.2fr_0.8fr]">
					<div>
						<p className="text-sm text-[#8b7355]">{siteCopy.kicker}</p>
						<h1 className="mt-4 font-[family-name:var(--font-variant-serif)] text-5xl leading-[1.1] sm:text-6xl">
							{siteCopy.headline}
						</h1>
						<p className="mt-8 max-w-xl text-lg leading-relaxed text-[#5c4e3b]">
							{siteCopy.lead}
						</p>
						<div className="mt-10 flex flex-wrap gap-4">
							<Link
								href="/abogados"
								className="rounded-full bg-[#3a2f22] px-6 py-3 text-sm text-[#f3ead9]"
							>
								{siteCopy.ctaPrimary}
							</Link>
							<Link
								href="/sign-in"
								className="rounded-full border border-[#c4b194] px-6 py-3 text-sm"
							>
								{siteCopy.ctaSecondary}
							</Link>
						</div>
					</div>
					<aside className="self-end rounded-3xl border border-[#d9c9aa] bg-[#efe4d0] p-8">
						<p className="text-xs uppercase tracking-[0.2em] text-[#8b7355]">
							Sala
						</p>
						<p className="mt-4 font-[family-name:var(--font-variant-serif)] text-2xl">
							Espere. El expediente ya habla.
						</p>
						<p className="mt-4 text-sm leading-relaxed text-[#6d5c45]">
							Como en una recepción de estudio: asientos holgados, madera clara
							y ninguna prisa por vender un resultado.
						</p>
					</aside>
				</section>
				<section className="border-t border-[#d9c9aa] bg-[#efe6d4]">
					<div className="mx-auto grid max-w-6xl gap-10 px-8 py-16 md:grid-cols-3">
						{[
							[siteCopy.privacyTitle, siteCopy.privacy],
							[siteCopy.trustTitle, siteCopy.trust],
							[siteCopy.hierarchyTitle, siteCopy.hierarchy],
						].map(([title, body]) => (
							<article key={title}>
								<h2 className="font-[family-name:var(--font-variant-serif)] text-2xl">
									{title}
								</h2>
								<p className="mt-3 text-sm leading-relaxed text-[#5c4e3b]">
									{body}
								</p>
							</article>
						))}
					</div>
				</section>
				<section className="mx-auto max-w-6xl px-8 py-20">
					<div className="grid gap-6 sm:grid-cols-4">
						{stats.map((item) => (
							<div key={item.label} className="border-t border-[#c4b194] pt-4">
								<p className="font-[family-name:var(--font-variant-serif)] text-4xl">
									{item.value}
								</p>
								<p className="mt-2 text-sm">{item.label}</p>
								<p className="text-xs text-[#8b7355]">{item.hint}</p>
							</div>
						))}
					</div>
					<ul className="mt-16 grid gap-4 md:grid-cols-3">
						{sampleLawyers.map((lawyer) => (
							<li key={lawyer.slug}>
								<Link
									href={`/abogados/${lawyer.slug}`}
									className="block rounded-2xl bg-[#fffaf2] p-6 shadow-sm"
								>
									<p className="text-xs text-[#8b7355]">{lawyer.sede}</p>
									<p className="mt-2 font-[family-name:var(--font-variant-serif)] text-xl">
										{lawyer.name}
									</p>
									<p className="mt-1 text-sm">
										{lawyer.materia} · {lawyer.colegio}
									</p>
								</Link>
							</li>
						))}
					</ul>
				</section>
			</main>
			<footer className="px-8 py-10 text-center text-xs text-[#8b7355]">
				{siteCopy.footer}
			</footer>
		</div>
	);
}
