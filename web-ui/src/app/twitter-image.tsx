import { ImageResponse } from "next/og";
import { siteCopy } from "@/features/marketing/data/copy";

export const alt = `${siteCopy.brand}: ${siteCopy.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
	return new ImageResponse(
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				width: "100%",
				height: "100%",
				padding: 80,
				background: "#1a1916",
				color: "#f4f1ea",
			}}
		>
			<div
				style={{
					fontSize: 28,
					letterSpacing: 8,
					textTransform: "uppercase",
					color: "#c4a574",
				}}
			>
				{siteCopy.brand}
			</div>
			<div
				style={{
					marginTop: 28,
					fontSize: 52,
					lineHeight: 1.2,
					maxWidth: 980,
				}}
			>
				{siteCopy.headline}
			</div>
			<div
				style={{
					marginTop: 24,
					fontSize: 24,
					color: "#d5d0c4",
					maxWidth: 900,
				}}
			>
				{siteCopy.kicker}
			</div>
		</div>,
		{ ...size },
	);
}
