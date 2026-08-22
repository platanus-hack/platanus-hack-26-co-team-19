type JsonLdProps = {
	data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload is serialized from our own objects
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}
