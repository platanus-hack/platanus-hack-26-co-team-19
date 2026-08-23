import { listJueces } from "../src/features/judge-profile/server/juez.repository";

const jueces = await listJueces();
const unique = [...new Map(jueces.map((j) => [j.slug, j.ponente])).entries()];
console.log(`perfiles=${jueces.length} slugs_unicos=${unique.length}`);
for (const [slug, ponente] of unique.sort((a, b) => a[0].localeCompare(b[0]))) {
	console.log(`${slug}\t${ponente}`);
}
