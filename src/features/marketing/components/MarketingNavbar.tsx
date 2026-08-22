"use client";

import { User2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/contact", label: "Contact" },
];

export function MarketingNavbar() {
	const pathname = usePathname();

	return (
		<header className="border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
			<div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<Link
					href="/"
					className="flex items-center gap-2 font-semibold tracking-tight"
				>
					<Image
						src="/deley-pe-logo.png"
						alt=""
						width={28}
						height={28}
						className="size-7 rounded-md"
					/>
					deley.pe
				</Link>
				<nav className="flex items-center gap-1 sm:gap-2">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								"rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
								pathname === link.href && "text-foreground font-medium",
							)}
						>
							{link.label}
						</Link>
					))}
					<Button asChild variant="outline" size="sm" className="ml-1">
						<Link href="/sign-in">
							<User2Icon className="size-4" />
							<span className="hidden sm:inline">Sign in</span>
						</Link>
					</Button>
				</nav>
			</div>
		</header>
	);
}
