import Link from "next/link";
import { VariantNav } from "../components/VariantNav";
import { sampleLawyers, siteCopy, stats } from "../data/copy";

export default function GaleriaPasilloLanding() {
	return (
		<div className="min-h-svh bg-[#f7f5f1] text-[#2b241c]">
			<VariantNav slug="galeria-pasillo" />
			<div className="grid min-h-svh lg:grid-cols-[1.4fr_0.6fr]">
				<section className="px-8 py-12 lg:px-14">
					<div className="flex items-center gap-3">
						<div className="h-8 w-1.5 bg-[#8b5a2b]" />
						<p className="font-[family-name:var(--font-variant-serif)] text-2xl">
							{siteCopy.brand}
						</p>
					</div>
					<p className="mt-12 text-xs tracking-[0.3em] text-[#8b5a2b] uppercase">
						Galería pública
					</p>
					<h1 className="mt-4 max-w-xl font-[family-name:var(--font-variant-serif)] text-5xl leading-tight">
						{siteCopy.headline}
					</h1>
					<p className="mt-6 max-w-lg leading-relaxed text-[#53493c]">
						{siteCopy.lead}
					</p>
					<div className="mt-8 flex gap-3">
						<Link
							href="/abogados"
							className="bg-[#2b241c] px-5 py-3 text-sm text-[#f7f5f1]"
						>
							{siteCopy.ctaPrimary}
						</Link>
						<Link
							href="/sign-in"
							className="border border-[#8b5a2b] px-5 py-3 text-sm text-[#8b5a2b]"
						>
							{siteCopy.ctaSecondary}
						</Link>
					</div>
					<div className="mt-14 grid gap-6 sm:grid-cols-2">
						{[
							[siteCopy.trustTitle, siteCopy.trust],
							[siteCopy.hierarchyTitle, siteCopy.hierarchy],
						].map(([title, body]) => (
							<article key={title}>
								<h2 className="font-[family-name:var(--font-variant-serif)] text-xl">
									{title}
								</h2>
								<p className="mt-2 text-sm leading-relaxed text-[#53493c]">
									{body}
								</p>
							</article>
						))}
					</div>
					<div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
						{stats.map((item) => (
							<div
								key={item.label}
								className="border-t-2 border-[#8b5a2b] pt-3"
							>
								<p className="text-2xl font-medium">{item.value}</p>
								<p className="text-xs text-[#53493c]">{item.label}</p>
							</div>
						))}
					</div>
					<ul className="mt-12 grid gap-3 sm:grid-cols-3">
						{sampleLawyers.map((lawyer) => (
							<li key={lawyer.slug}>
								<Link
									href={`/abogados/${lawyer.slug}`}
									className="block bg-white p-4 shadow-sm"
								>
									<p className="text-xs text-[#8b5a2b]">{lawyer.sede}</p>
									<p className="mt-1 font-[family-name:var(--font-variant-serif)]">
										{lawyer.name}
									</p>
								</Link>
							</li>
						))}
					</ul>
				</section>
				<aside className="bg-[#3a2c22] px-8 py-12 text-[#e8dcc8]">
					<div className="h-full border-l border-[#8b5a2b] pl-8">
						<p className="text-[10px] tracking-[0.4em] text-[#c4a46a] uppercase">
							Pasillo privado
						</p>
						<h2 className="mt-6 font-[family-name:var(--font-variant-serif)] text-3xl">
							{siteCopy.privacyTitle}
						</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#cbbba6]">
							{siteCopy.privacy}
						</p>
						<p className="mt-8 text-sm leading-relaxed text-[#cbbba6]">
							Esta franja no es un ranking. Es el corredor donde el estudio
							guarda lo que no corresponde a la galería.
						</p>
						<Link
							href="/sign-in"
							className="mt-10 inline-block text-sm text-[#c4a46a] underline"
						>
							Continuar con acceso
						</Link>
						<p className="mt-16 text-xs text-[#8a7360]">{siteCopy.footer}</p>
					</div>
				</aside>
			</div>
		</div>
	);
}
