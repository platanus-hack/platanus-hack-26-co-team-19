import Link from "next/link";
import { VariantNav } from "../components/VariantNav";
import { sampleLawyers, siteCopy, stats } from "../data/copy";

export default function DespachoLanding() {
	return (
		<div className="min-h-svh bg-[#1c140f] text-[#e8dcc8]">
			<VariantNav slug="despacho" />
			<div className="grid min-h-svh lg:grid-cols-[220px_1fr]">
				<aside className="hidden flex-col justify-between border-r border-[#3a2c22] bg-[#140e0a] p-8 lg:flex">
					<div>
						<p className="text-[10px] tracking-[0.4em] text-[#c4a46a]">
							ESTUDIO
						</p>
						<p className="mt-4 font-[family-name:var(--font-variant-serif)] text-2xl text-[#f0e6d4]">
							{siteCopy.brand}
						</p>
					</div>
					<nav className="flex flex-col gap-4 text-sm text-[#b9a48a]">
						<Link href="/abogados">Directorio</Link>
						<Link href="/sign-in">Ingreso</Link>
					</nav>
					<p className="text-[10px] leading-relaxed tracking-wide text-[#7a6550]">
						Puerta cerrada. Expediente abierto.
					</p>
				</aside>
				<main className="px-8 py-12 lg:px-16">
					<p className="text-xs tracking-[0.3em] text-[#c4a46a]">
						{siteCopy.kicker}
					</p>
					<h1 className="mt-6 max-w-3xl font-[family-name:var(--font-variant-serif)] text-4xl leading-tight text-[#f3ead9] sm:text-5xl">
						{siteCopy.headline}
					</h1>
					<p className="mt-6 max-w-xl text-sm leading-7 text-[#cbbba6]">
						{siteCopy.lead}
					</p>
					<div className="mt-8 flex gap-4">
						<Link
							href="/abogados"
							className="bg-[#c4a46a] px-5 py-3 text-sm text-[#1c140f]"
						>
							{siteCopy.ctaPrimary}
						</Link>
						<Link
							href="/sign-in"
							className="border border-[#c4a46a]/50 px-5 py-3 text-sm text-[#c4a46a]"
						>
							{siteCopy.ctaSecondary}
						</Link>
					</div>
					<section className="mt-16 grid gap-px bg-[#3a2c22] sm:grid-cols-2">
						{[
							[siteCopy.privacyTitle, siteCopy.privacy],
							[siteCopy.trustTitle, siteCopy.trust],
							[siteCopy.hierarchyTitle, siteCopy.hierarchy],
							[
								"Madera y cuero",
								"El dato se presenta con la misma contención que un despacho de nogal: poco brillo, mucha densidad.",
							],
						].map(([title, body]) => (
							<article key={title} className="bg-[#241910] p-8">
								<div className="mb-4 h-1 w-10 bg-[#c4a46a]" />
								<h2 className="font-[family-name:var(--font-variant-serif)] text-xl text-[#e8dcc8]">
									{title}
								</h2>
								<p className="mt-3 text-sm leading-relaxed text-[#b9a48a]">
									{body}
								</p>
							</article>
						))}
					</section>
					<section className="mt-12 grid grid-cols-2 gap-8 border-t border-[#3a2c22] pt-10 sm:grid-cols-4">
						{stats.map((item) => (
							<div key={item.label}>
								<p className="font-[family-name:var(--font-variant-serif)] text-3xl text-[#c4a46a]">
									{item.value}
								</p>
								<p className="mt-1 text-xs text-[#b9a48a]">{item.label}</p>
							</div>
						))}
					</section>
					<ul className="mt-12 space-y-3">
						{sampleLawyers.map((lawyer) => (
							<li key={lawyer.slug}>
								<Link
									href={`/abogados/${lawyer.slug}`}
									className="flex items-center justify-between border border-[#3a2c22] bg-[#140e0a] px-5 py-4"
								>
									<span className="font-[family-name:var(--font-variant-serif)]">
										{lawyer.name}
									</span>
									<span className="text-xs text-[#c4a46a]">
										{lawyer.materia} · {lawyer.sede}
									</span>
								</Link>
							</li>
						))}
					</ul>
					<p className="mt-16 text-xs text-[#7a6550]">{siteCopy.footer}</p>
				</main>
			</div>
		</div>
	);
}
