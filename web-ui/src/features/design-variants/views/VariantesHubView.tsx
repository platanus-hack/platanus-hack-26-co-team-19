import Link from "next/link";
import { siteCopy } from "../data/copy";
import { variants } from "../data/variants";

export default function VariantesHubView() {
	return (
		<div className="min-h-svh bg-[#f4efe6] text-[#2c2416]">
			<header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8">
				<Link href="/" className="text-sm tracking-wide">
					{siteCopy.brand}
				</Link>
				<p className="text-xs uppercase tracking-[0.2em] text-[#7a6a52]">
					Exploración visual
				</p>
			</header>
			<main className="mx-auto w-full max-w-5xl px-6 pb-24">
				<p className="font-[family-name:var(--font-variant-serif)] text-sm text-[#7a6a52]">
					Diez recepciones para el mismo mensaje
				</p>
				<h1 className="mt-3 max-w-3xl font-[family-name:var(--font-variant-serif)] text-4xl leading-tight sm:text-5xl">
					Cómo se vería deley.pe si el diseño hablara el idioma de un despacho
				</h1>
				<p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#5c4f3c]">
					Privacidad, sobriedad y confianza: maderas cálidas, silencio acústico
					y una jerarquía clara. Elige una variante; el contenido es el mismo,
					el ambiente no.
				</p>
				<ul className="mt-12 grid gap-4 sm:grid-cols-2">
					{variants.map((item) => (
						<li key={item.slug}>
							<Link
								href={`/variantes/${item.slug}`}
								className="block rounded-sm border border-[#d8cbb6] bg-[#faf6ef] p-5 transition hover:border-[#b89a6a] hover:bg-white"
							>
								<p className="text-xs tracking-[0.25em] text-[#9a8564]">
									{item.number}
								</p>
								<h2 className="mt-2 font-[family-name:var(--font-variant-serif)] text-2xl">
									{item.title}
								</h2>
								<p className="mt-1 text-xs uppercase tracking-wide text-[#8a7354]">
									{item.palette}
								</p>
								<p className="mt-3 text-sm text-[#5c4f3c]">{item.idea}</p>
							</Link>
						</li>
					))}
				</ul>
			</main>
		</div>
	);
}
