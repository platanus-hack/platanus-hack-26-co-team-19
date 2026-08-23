"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { JudgePublicProfile } from "../schemas/judge-profile.schema";
import { EvidenciaPanel } from "./EvidenciaPanel";
import { LecturaPanel } from "./LecturaPanel";
import { ResultPanel } from "./ResultPanel";

type JudgeProfileTabsProps = {
	profile: JudgePublicProfile;
};

export const JudgeProfileTabs = ({ profile }: JudgeProfileTabsProps) => {
	return (
		<Tabs defaultValue="indicadores" className="w-full min-w-0">
			<TabsList className="grid h-auto w-full grid-cols-3">
				<TabsTrigger value="indicadores" className="px-1 text-xs sm:text-sm">
					Indicadores
				</TabsTrigger>
				<TabsTrigger value="lectura" className="px-1 text-xs sm:text-sm">
					Lectura
				</TabsTrigger>
				<TabsTrigger value="evidencia" className="px-1 text-xs sm:text-sm">
					Evidencia
				</TabsTrigger>
			</TabsList>
			<TabsContent value="indicadores" className="mt-4 flex flex-col gap-4">
				<ResultPanel profile={profile} />
			</TabsContent>
			<TabsContent value="lectura" className="mt-4">
				<LecturaPanel profile={profile} />
			</TabsContent>
			<TabsContent value="evidencia" className="mt-4">
				<EvidenciaPanel profile={profile} />
			</TabsContent>
		</Tabs>
	);
};
