import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NavHeader from "@/features/dashboard/components/nav-header";
import { AppSidebar } from "@/features/dashboard/templates/app-sidebar";

export const metadata: Metadata = {
	title: "Panel",
	robots: { index: false, follow: false },
};

type DashBoardLayoutProps = {
	children: React.ReactNode;
};

export default function DashBoardLayout({ children }: DashBoardLayoutProps) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<NavHeader />
				<div className="h-full w-full p-4 pt-0">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
