import { ImageResponse } from "next/og";
import { siteCopy } from "@/features/marketing/data/copy";

export const alt = `${siteCopy.brand}: ${siteCopy.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
	return new ImageResponse(
		<div
			style={{
				display: "flex",
				alignItems: "center",
				width: "100%",
				height: "100%",
				padding: 80,
				background: "#1a1916",
				color: "#f4f1ea",
				gap: 48,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: 180,
					height: 180,
					background: "#1a1916",
					color: "#c4a574",
					fontSize: 110,
					fontWeight: 700,
					border: "2px solid #c4a574",
				}}
			>
				d
			</div>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						fontSize: 42,
						letterSpacing: 6,
						color: "#c4a574",
					}}
				>
					{siteCopy.brand}
				</div>
				<div
					style={{
						marginTop: 16,
						fontSize: 36,
						lineHeight: 1.3,
						maxWidth: 780,
					}}
				>
					{siteCopy.headline}
				</div>
			</div>
		</div>,
		{ ...size },
	);
}
