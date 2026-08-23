import type { Metadata, Viewport } from "next";
import { Geist_Mono, Libre_Baskerville, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { site } from "@/features/marketing/data/site";
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

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
		{ media: "(prefers-color-scheme: dark)", color: "#1a1916" },
	],
};

export const metadata: Metadata = {
	metadataBase: new URL(site.url),
	title: {
		default: site.defaultTitle,
		template: site.titleTemplate,
	},
	description: site.defaultDescription,
	applicationName: site.name,
	authors: [{ name: site.name, url: site.url }],
	keywords: [...site.keywords],
	icons: {
		icon: [{ url: "/icon", type: "image/png" }],
		apple: [{ url: "/apple-icon", type: "image/png" }],
	},
	alternates: {
		canonical: "/",
	},
	robots: {
		index: true,
		follow: true,
	},
	openGraph: {
		type: "website",
		locale: site.locale,
		siteName: site.name,
		title: site.ogTitle,
		description: site.defaultDescription,
		url: site.url,
		images: [{ url: site.ogImage }],
	},
	twitter: {
		card: "summary_large_image",
		title: site.ogTitle,
		description: site.defaultDescription,
		images: [site.ogImage],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang={site.lang} suppressHydrationWarning>
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
