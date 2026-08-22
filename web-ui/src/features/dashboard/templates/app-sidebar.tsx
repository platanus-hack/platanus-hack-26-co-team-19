"use client";

import { type Frame, SquareTerminal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import ChatSidebarHistory from "@/features/chat/components/ChatSidebarHistory";
import { NavMain } from "@/features/dashboard/components/nav-main";
import { NavProjects } from "@/features/dashboard/components/nav-projects";
import { NavUser } from "@/features/dashboard/components/nav-user";

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "#",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "Abogados",
					url: "/dashboard",
				},
				{
					title: "Perfil",
					url: "/dashboard/profile",
				},
				{
					title: "Contactos",
					url: "/dashboard/contacts",
				},
				{
					title: "Chat",
					url: "/dashboard/chat",
				},
			],
		},
	],
	projects: [] as {
		name: string;
		url: string;
		icon: typeof Frame;
	}[],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const isChat = pathname.startsWith("/dashboard/chat");

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<Link
					href="/"
					className="px-2 py-1.5 font-serif text-sm tracking-[0.2em]"
				>
					deley.com
				</Link>
			</SidebarHeader>
			<div className="px-4">
				<Separator />
			</div>
			<SidebarContent>
				{isChat ? (
					<Suspense fallback={null}>
						<ChatSidebarHistory />
					</Suspense>
				) : (
					<>
						<NavMain items={data.navMain} />
						{data.projects.length > 0 ? (
							<NavProjects projects={data.projects} />
						) : null}
					</>
				)}
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
