"use client";

import { User2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import BrandMark from "@/features/marketing/components/BrandMark";
import { cn } from "@/lib/utils";

const links = [
	{ href: "/", label: "Inicio" },
	{ href: "/jueces", label: "Buscar" },
	{ href: "/dashboard/chat", label: "Chat" },
	{ href: "/docs", label: "Docs" },
	{ href: "/about", label: "Acerca" },
	{ href: "/contact", label: "Contacto" },
];

export function MarketingNavbar() {
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-50 border-b border-accent/40 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<Link
					href="/"
					className="flex items-center gap-2 font-serif tracking-[0.15em]"
				>
					<BrandMark className="size-7 text-lg" />
					deley.com
				</Link>
				<nav className="flex items-center gap-1 sm:gap-2">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								"px-3 py-2 text-[10px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground",
								(link.href === "/"
									? pathname === "/"
									: pathname.startsWith(link.href)) &&
									"font-medium text-accent",
							)}
						>
							{link.label}
						</Link>
					))}
					<Button asChild variant="outline" size="sm" className="ml-1">
						<Link href="/sign-in">
							<User2Icon className="size-4" />
							<span className="hidden sm:inline">Ingresar</span>
						</Link>
					</Button>
				</nav>
			</div>
		</header>
	);
}
