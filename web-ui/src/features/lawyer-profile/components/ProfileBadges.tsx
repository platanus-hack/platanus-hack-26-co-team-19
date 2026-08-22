"use client";

import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { LawyerBadge } from "../schemas/lawyer-profile.schema";

type ProfileBadgesProps = {
	badges: LawyerBadge[];
};

const formatConfidence = (value: number) => `${Math.round(value * 100)}%`;

export const ProfileBadges = ({ badges }: ProfileBadgesProps) => {
	return (
		<section className="flex flex-col gap-3">
			<TooltipProvider>
				<div className="flex flex-wrap gap-2">
					{badges.map((badge) => (
						<Tooltip key={badge.code}>
							<TooltipTrigger asChild>
								<Badge variant="secondary" className="cursor-help">
									{badge.label}
								</Badge>
							</TooltipTrigger>
							<TooltipContent className="max-w-xs text-pretty">
								<p>{badge.rule}</p>
								<p className="mt-1 text-xs opacity-80">
									Confianza {formatConfidence(badge.confidence)}
								</p>
							</TooltipContent>
						</Tooltip>
					))}
				</div>
			</TooltipProvider>
		</section>
	);
};
