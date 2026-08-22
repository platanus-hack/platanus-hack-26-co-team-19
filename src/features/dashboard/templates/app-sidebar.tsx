"use client";

import {
	AudioWaveform,
	Command,
	type Frame,
	GalleryVerticalEnd,
	SquareTerminal,
} from "lucide-react";
import type * as React from "react";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/features/dashboard/components/nav-main";
import { NavProjects } from "@/features/dashboard/components/nav-projects";
import { NavUser } from "@/features/dashboard/components/nav-user";
import { TeamSwitcher } from "@/features/dashboard/components/team-switcher";

// This is sample data.
const data = {
	teams: [
		{
			name: "Acme Inc",
			logo: GalleryVerticalEnd,
			plan: "Enterprise",
		},
		{
			name: "Acme Corp.",
			logo: AudioWaveform,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Command,
			plan: "Free",
		},
	],
	navMain: [
		{
			title: "Dashboard",
			url: "#",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "Inicio",
					url: "/dashboard",
				},
				{
					title: "Contactos",
					url: "/dashboard/contacts",
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
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<div className="px-4">
				<Separator />
			</div>
			<SidebarContent>
				<NavMain items={data.navMain} />
				{data.projects.length > 0 ? (
					<NavProjects projects={data.projects} />
				) : null}
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
