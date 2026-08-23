"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

const ThemeSwitch = () => {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="h-6 w-36" aria-hidden />;
	}

	const isDark = resolvedTheme === "dark";

	return (
		<div className="flex items-center gap-2 px-4">
			<Sun className="size-3.5 text-accent" />
			<span className="text-[10px] tracking-[0.2em] uppercase">
				{isDark ? "Oscuro" : "Claro"}
			</span>
			<Switch
				checked={isDark}
				onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
				aria-label="Cambiar tema"
			/>
			<Moon className="size-3.5 text-accent" />
		</div>
	);
};

export default ThemeSwitch;
