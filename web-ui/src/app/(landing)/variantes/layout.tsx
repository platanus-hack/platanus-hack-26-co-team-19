import { Libre_Baskerville, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";

const serif = Libre_Baskerville({
	weight: ["400", "700"],
	subsets: ["latin"],
	variable: "--font-variant-serif",
});

const sans = Source_Sans_3({
	subsets: ["latin"],
	variable: "--font-variant-sans",
});

type Props = {
	children: ReactNode;
};

export default function VariantesLayout({ children }: Props) {
	return (
		<div
			className={`${serif.variable} ${sans.variable} font-[family-name:var(--font-variant-sans)]`}
		>
			{children}
		</div>
	);
}
