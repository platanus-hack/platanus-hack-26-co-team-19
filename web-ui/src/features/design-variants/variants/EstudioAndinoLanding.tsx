import Link from "next/link";
import { VariantNav } from "../components/VariantNav";
import { sampleLawyers, siteCopy, stats } from "../data/copy";

export default function EstudioAndinoLanding() {
	return (
		<div className="min-h-svh bg-[#f2e6d4] text-[#3d2a1c]">
			<VariantNav slug="estudio-andino" />
			<header className="relative overflow-hidden bg-[#c45c32] px-8 py-16 text-[#f8efe4]">
				<div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[repeating-linear-gradient(90deg,#b44e28_0_12px,#c45c32_12px_24px)] opacity-40" />
				<div className="relative mx-auto max-w-5xl">
					<p className="text-xs tracking-[0.35em] uppercase">
						Lima · Arequipa · el expediente
					</p>
					<p className="mt-4 font-[family-name:var(--font-variant-serif)] text-4xl">
						{siteCopy.brand}
					</p>
					<nav className="mt-6 flex gap-6 text-sm">
						<Link href="/abogados">Buscar</Link>
						<Link href="/sign-in">Entrar</Link>
					</nav>
				</div>
			</header>
			<main className="mx-auto max-w-5xl px-8 py-16">
				<p className="text-sm text-[#a85a38]">{siteCopy.kicker}</p>
				<h1 className="mt-4 max-w-3xl font-[family-name:var(--font-variant-serif)] text-5xl leading-tight">
					{siteCopy.headline}
				</h1>
				<p className="mt-6 max-w-2xl text-lg leading-relaxed">
					{siteCopy.lead}
				</p>
				<div className="mt-8 flex flex-wrap gap-3">
					<Link
						href="/abogados"
						className="rounded-sm bg-[#3d2a1c] px-6 py-3 text-sm text-[#f2e6d4]"
					>
						{siteCopy.ctaPrimary}
					</Link>
					<Link
						href="/sign-in"
						className="rounded-sm border border-[#c45c32] px-6 py-3 text-sm text-[#c45c32]"
					>
						{siteCopy.ctaSecondary}
					</Link>
				</div>
				<section className="mt-16 grid gap-8 md:grid-cols-3">
					{[
						[siteCopy.privacyTitle, siteCopy.privacy],
						[siteCopy.trustTitle, siteCopy.trust],
						[siteCopy.hierarchyTitle, siteCopy.hierarchy],
					].map(([title, body]) => (
						<article key={title} className="rounded-tl-3xl bg-[#efe0c9] p-6">
							<h2 className="font-[family-name:var(--font-variant-serif)] text-2xl text-[#c45c32]">
								{title}
							</h2>
							<p className="mt-3 text-sm leading-relaxed">{body}</p>
						</article>
					))}
				</section>
				<section className="mt-12 flex flex-wrap gap-10 border-y border-[#d9c4a8] py-10">
					{stats.map((item) => (
						<div key={item.label}>
							<p className="font-[family-name:var(--font-variant-serif)] text-4xl text-[#c45c32]">
								{item.value}
							</p>
							<p className="text-sm">{item.label}</p>
						</div>
					))}
				</section>
				<ul className="mt-12 grid gap-4 sm:grid-cols-3">
					{sampleLawyers.map((lawyer) => (
						<li key={lawyer.slug}>
							<Link
								href={`/abogados/${lawyer.slug}`}
								className="block border border-[#d9c4a8] bg-[#faf3e8] p-5"
							>
								<p className="text-xs text-[#a85a38]">{lawyer.sede}</p>
								<p className="mt-2 font-[family-name:var(--font-variant-serif)] text-xl">
									{lawyer.name}
								</p>
								<p className="text-sm">{lawyer.materia}</p>
							</Link>
						</li>
					))}
				</ul>
			</main>
			<footer className="bg-[#3d2a1c] px-8 py-8 text-center text-xs text-[#f2e6d4]">
				{siteCopy.footer}
			</footer>
		</div>
	);
}
