import Link from "next/link";
import { VariantNav } from "../components/VariantNav";
import { sampleLawyers, siteCopy, stats } from "../data/copy";

export default function SalaAudienciasLanding() {
	return (
		<div className="min-h-svh bg-[#eceae6] text-[#1f1e1c]">
			<VariantNav slug="sala-audiencias" />
			<header className="border-b-8 border-[#1f1e1c] bg-[#f7f6f3]">
				<div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-10 text-center">
					<p className="text-[10px] tracking-[0.5em] uppercase">Sala</p>
					<p className="mt-3 font-[family-name:var(--font-variant-serif)] text-4xl tracking-tight">
						{siteCopy.brand}
					</p>
					<nav className="mt-6 flex gap-10 text-xs tracking-[0.25em] uppercase">
						<Link href="/abogados">Directorio</Link>
						<Link href="/sign-in">Ingreso</Link>
					</nav>
				</div>
			</header>
			<main>
				<section className="mx-auto max-w-3xl px-6 py-20 text-center">
					<p className="text-xs tracking-[0.3em] text-[#5e5c57]">
						{siteCopy.kicker}
					</p>
					<h1 className="mt-6 font-[family-name:var(--font-variant-serif)] text-5xl leading-tight">
						{siteCopy.headline}
					</h1>
					<p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-[#4a4945]">
						{siteCopy.lead}
					</p>
					<div className="mt-10 flex justify-center gap-4">
						<Link
							href="/abogados"
							className="bg-[#1f1e1c] px-8 py-3 text-xs tracking-[0.2em] text-white uppercase"
						>
							{siteCopy.ctaPrimary}
						</Link>
						<Link
							href="/sign-in"
							className="border border-[#1f1e1c] px-8 py-3 text-xs tracking-[0.2em] uppercase"
						>
							{siteCopy.ctaSecondary}
						</Link>
					</div>
				</section>
				<section className="grid border-y border-[#cfcbc3] md:grid-cols-3">
					{[
						[siteCopy.privacyTitle, siteCopy.privacy],
						[siteCopy.trustTitle, siteCopy.trust],
						[siteCopy.hierarchyTitle, siteCopy.hierarchy],
					].map(([title, body], i) => (
						<article
							key={title}
							className={`px-8 py-12 ${i === 1 ? "bg-[#1f1e1c] text-[#eceae6]" : "bg-[#f7f6f3]"}`}
						>
							<p className="text-[10px] tracking-[0.4em]">0{i + 1}</p>
							<h2 className="mt-4 font-[family-name:var(--font-variant-serif)] text-2xl">
								{title}
							</h2>
							<p className="mt-4 text-sm leading-relaxed opacity-80">{body}</p>
						</article>
					))}
				</section>
				<section className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-[#cfcbc3] px-0 py-0 sm:grid-cols-4">
					{stats.map((item) => (
						<div key={item.label} className="bg-[#eceae6] p-8 text-center">
							<p className="font-[family-name:var(--font-variant-serif)] text-4xl">
								{item.value}
							</p>
							<p className="mt-2 text-[10px] tracking-[0.2em] uppercase">
								{item.label}
							</p>
						</div>
					))}
				</section>
				<ul className="mx-auto max-w-3xl divide-y divide-[#cfcbc3] px-6 py-16">
					{sampleLawyers.map((lawyer) => (
						<li key={lawyer.slug} className="py-5">
							<Link
								href={`/abogados/${lawyer.slug}`}
								className="flex items-baseline justify-between gap-4"
							>
								<span className="font-[family-name:var(--font-variant-serif)] text-xl">
									{lawyer.name}
								</span>
								<span className="text-xs tracking-widest uppercase text-[#5e5c57]">
									{lawyer.materia}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</main>
			<footer className="border-t-8 border-[#1f1e1c] py-8 text-center text-[10px] tracking-[0.2em] uppercase">
				{siteCopy.footer}
			</footer>
		</div>
	);
}
