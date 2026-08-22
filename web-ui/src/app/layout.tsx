import type { Metadata } from "next";
import { Geist_Mono, Libre_Baskerville, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/trpc/client";

const sourceSans = Source_Sans_3({
	variable: "--font-source-sans",
	subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
	weight: ["400", "700"],
	variable: "--font-libre-baskerville",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Acme Inc.",
	description: "Next.js Better Auth template",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${sourceSans.variable} ${libreBaskerville.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<TRPCReactProvider>
						<TooltipProvider>
							{children}
							<Toaster />
						</TooltipProvider>
					</TRPCReactProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
