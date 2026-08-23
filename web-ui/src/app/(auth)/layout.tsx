import type { Metadata } from "next";
import Link from "next/link";
import BrandMark from "@/features/marketing/components/BrandMark";
import { site } from "@/features/marketing/data/site";

export const metadata: Metadata = {
	title: "Acceso",
	robots: { index: false, follow: false },
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<Link
						href="/"
						className="flex items-center gap-2 font-serif tracking-[0.15em]"
					>
						<BrandMark className="size-6 text-base" />
						{site.name}
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="flex w-full items-center justify-center">
						{children}
					</div>
				</div>
			</div>
			<div className="hidden items-center justify-center bg-[#1a1916] lg:flex">
				<span className="font-serif text-8xl font-bold text-[#c4a574]">d</span>
			</div>
		</div>
	);
}
