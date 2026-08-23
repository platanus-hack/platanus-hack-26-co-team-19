"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
	className?: string;
};

const BrandMark = ({ className }: BrandMarkProps) => {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = mounted && resolvedTheme === "dark";

	return (
		<span
			aria-hidden
			className={cn(
				"inline-flex shrink-0 items-center justify-center font-serif font-bold leading-none",
				isDark ? "bg-[#c4a574] text-[#1a1916]" : "bg-[#1a1916] text-[#c4a574]",
				className,
			)}
		>
			d
		</span>
	);
};

export default BrandMark;
