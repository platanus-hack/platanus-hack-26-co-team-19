import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
					<Link href="/" className="flex items-center gap-2 font-medium">
						<Image
							src="/deley-pe-logo.png"
							alt={site.name}
							width={24}
							height={24}
							className="size-6"
						/>
						{site.name}
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="flex w-full items-center justify-center">
						{children}
					</div>
				</div>
			</div>
			<div className="relative hidden bg-muted lg:block">
				<Image
					src="/deley-pe-logo.png"
					alt=""
					fill
					className="object-contain p-16 opacity-40"
				/>
			</div>
		</div>
	);
}
