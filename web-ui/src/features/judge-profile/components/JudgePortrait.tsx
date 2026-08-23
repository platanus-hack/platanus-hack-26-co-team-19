import Image from "next/image";

type JudgePortraitProps = {
	name: string;
	initials: string;
	photoUrl: string | null;
	size: "sm" | "lg";
};

const SIZE = {
	sm: "size-14 rounded-full",
	lg: "size-16 rounded-xl sm:size-20",
} as const;

const PX = { sm: 56, lg: 80 } as const;

export const JudgePortrait = ({
	name,
	initials,
	photoUrl,
	size,
}: JudgePortraitProps) => {
	if (photoUrl) {
		return (
			<Image
				src={photoUrl}
				alt={`Retrato ilustrativo de ${name}`}
				width={PX[size]}
				height={PX[size]}
				className={`${SIZE[size]} object-cover`}
			/>
		);
	}

	return (
		<div
			className={`flex items-center justify-center bg-muted font-serif ${SIZE[size]} ${size === "lg" ? "text-xl sm:text-2xl" : "text-sm"}`}
		>
			{initials}
		</div>
	);
};
