"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LawyerPublicProfile } from "../schemas/lawyer-profile.schema";
import { CaseHistory } from "./CaseHistory";
import { ContactPanel } from "./ContactPanel";
import { DataQualityPanel } from "./DataQualityPanel";
import { ProfileBadges } from "./ProfileBadges";
import { ResultPanel } from "./ResultPanel";

type LawyerProfileTabsProps = {
	profile: LawyerPublicProfile;
};

export const LawyerProfileTabs = ({ profile }: LawyerProfileTabsProps) => {
	return (
		<Tabs defaultValue="indicadores" className="w-full min-w-0">
			<TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4">
				<TabsTrigger value="indicadores" className="px-1 text-xs sm:text-sm">
					Indicadores
				</TabsTrigger>
				<TabsTrigger value="historial" className="px-1 text-xs sm:text-sm">
					<span className="sm:hidden">Expedientes</span>
					<span className="hidden sm:inline">Historial de expedientes</span>
				</TabsTrigger>
				<TabsTrigger value="calidad" className="px-1 text-xs sm:text-sm">
					Calidad
				</TabsTrigger>
				<TabsTrigger value="contacto" className="px-1 text-xs sm:text-sm">
					Contacto
				</TabsTrigger>
			</TabsList>
			<TabsContent value="indicadores" className="mt-4 flex flex-col gap-4">
				<ProfileBadges badges={profile.badges} />
				<ResultPanel panel={profile.resultPanel} />
			</TabsContent>
			<TabsContent value="historial" className="mt-4">
				<CaseHistory cases={profile.cases} />
			</TabsContent>
			<TabsContent value="calidad" className="mt-4">
				<DataQualityPanel dataQuality={profile.dataQuality} />
			</TabsContent>
			<TabsContent value="contacto" className="mt-4">
				<ContactPanel contact={profile.contact} />
			</TabsContent>
		</Tabs>
	);
};
