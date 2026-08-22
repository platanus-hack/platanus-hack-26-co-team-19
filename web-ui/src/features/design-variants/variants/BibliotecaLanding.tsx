import Link from "next/link";
import { VariantNav } from "../components/VariantNav";
import { sampleLawyers, siteCopy, stats } from "../data/copy";

const spines = ["CIV", "PEN", "LAB", "ADM", "CON", "COM", "FAM", "AMB"];

export default function BibliotecaLanding() {
	return (
		<div className="min-h-svh bg-[#f7f1e4] text-[#2b1618]">
			<VariantNav slug="biblioteca" />
			<div className="flex">
				<div className="hidden w-14 shrink-0 flex-col md:flex">
					{spines.map((code, i) => (
						<div
							key={code}
							className="flex flex-1 items-center justify-center border-b border-[#f7f1e4] text-[10px] tracking-widest text-[#f7f1e4]"
							style={{
								background: i % 2 === 0 ? "#6b1d2a" : "#4a1420",
							}}
						>
							<span className="rotate-180 [writing-mode:vertical-rl]">
								{code}
							</span>
						</div>
					))}
				</div>
				<div className="flex-1">
					<header className="flex items-center justify-between border-b border-[#e2d3c0] px-8 py-6">
						<p className="font-[family-name:var(--font-variant-serif)] text-2xl text-[#6b1d2a]">
							{siteCopy.brand}
						</p>
						<nav className="flex gap-6 text-sm">
							<Link href="/abogados">Hemeroteca</Link>
							<Link href="/sign-in">Sala de lectura</Link>
						</nav>
					</header>
					<main className="px-8 py-14">
						<p className="text-xs tracking-[0.25em] text-[#6b1d2a]">
							{siteCopy.kicker}
						</p>
						<h1 className="mt-4 max-w-3xl font-[family-name:var(--font-variant-serif)] text-5xl leading-tight">
							{siteCopy.headline}
						</h1>
						<p className="mt-6 max-w-2xl leading-relaxed text-[#5a3a3e]">
							{siteCopy.lead}
						</p>
						<div className="mt-8 flex gap-3">
							<Link
								href="/abogados"
								className="bg-[#6b1d2a] px-5 py-3 text-sm text-[#f7f1e4]"
							>
								{siteCopy.ctaPrimary}
							</Link>
							<Link
								href="/sign-in"
								className="border border-[#6b1d2a] px-5 py-3 text-sm"
							>
								{siteCopy.ctaSecondary}
							</Link>
						</div>
						<section className="mt-16 grid gap-6 md:grid-cols-3">
							{[siteCopy.privacy, siteCopy.trust, siteCopy.hierarchy].map(
								(body, i) => (
									<article
										key={body}
										className="border-l-4 border-[#6b1d2a] pl-5"
									>
										<h2 className="font-[family-name:var(--font-variant-serif)] text-xl">
											{
												[
													siteCopy.privacyTitle,
													siteCopy.trustTitle,
													siteCopy.hierarchyTitle,
												][i]
											}
										</h2>
										<p className="mt-2 text-sm leading-relaxed text-[#5a3a3e]">
											{body}
										</p>
									</article>
								),
							)}
						</section>
						<section className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
							{stats.map((item) => (
								<div key={item.label} className="bg-[#efe4d2] p-5">
									<p className="font-[family-name:var(--font-variant-serif)] text-3xl text-[#6b1d2a]">
										{item.value}
									</p>
									<p className="mt-2 text-xs uppercase tracking-wide">
										{item.label}
									</p>
								</div>
							))}
						</section>
						<ul className="mt-12 grid gap-3 md:grid-cols-3">
							{sampleLawyers.map((lawyer) => (
								<li
									key={lawyer.slug}
									className="bg-white p-5 shadow-[inset_0_0_0_1px_#e2d3c0]"
								>
									<Link href={`/abogados/${lawyer.slug}`}>
										<p className="text-[10px] tracking-[0.2em] text-[#6b1d2a]">
											VOL. {lawyer.materia.toUpperCase()}
										</p>
										<p className="mt-2 font-[family-name:var(--font-variant-serif)] text-lg">
											{lawyer.name}
										</p>
										<p className="text-xs text-[#5a3a3e]">{lawyer.colegio}</p>
									</Link>
								</li>
							))}
						</ul>
					</main>
					<footer className="border-t border-[#e2d3c0] px-8 py-6 text-xs text-[#8a6a6e]">
						{siteCopy.footer}
					</footer>
				</div>
			</div>
		</div>
	);
}
