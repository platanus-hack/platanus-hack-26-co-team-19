import s3Client from "@/lib/minio";
import prisma from "@/lib/prisma";

async function cleanBuckets() {
	try {
		const listBuckets = await s3Client.listBuckets();
		for (const bucket of listBuckets) {
			if (!bucket.name) continue;
			try {
				const objectsStream = s3Client.listObjects(bucket.name, "", true);
				const objectsToDelete: string[] = [];
				for await (const obj of objectsStream) {
					if (obj.name) objectsToDelete.push(obj.name);
				}
				if (objectsToDelete.length > 0) {
					await s3Client.removeObjects(bucket.name, objectsToDelete);
					console.log(
						`Emptying bucket ${bucket.name}: deleted ${objectsToDelete.length} objects`,
					);
				}
				await s3Client.removeBucket(bucket.name);
				console.log(`Removed bucket: ${bucket.name}`);
			} catch (err) {
				console.error(`Failed to remove bucket ${bucket.name}`, err);
			}
		}
	} catch (error: unknown) {
		console.error("Error deleting bucket:", error);
	}
}

// async function cleanPolarUsers() {
//   try {
//     let hasMore = true;
//     let page = 1;
//     while (hasMore) {
//       const response = await polarClient.customers.list({
//         limit: 100,
//         page,
//       });
//       const customers = response.result.items;
//       if (customers.length === 0) {
//         hasMore = false;
//         console.log("No more customers found.");
//         break;
//       }
//       for (const customer of customers) {
//         console.log(`Deleting customer: ${customer.email} (${customer.id})`);
//         await polarClient.customers.delete({
//           id: customer.id,
//         });
//       }
//       page++;
//     }
//     console.log("Polar user cleanup completed.");
//   } catch (error) {
//     console.error("Error running seed script:", error);
//   }
// }

async function cleanDatabase() {
	try {
		const tables = await prisma.$queryRaw<
			Array<{ tablename: string; schemaname: string }>
		>`SELECT tablename, schemaname FROM pg_tables WHERE schemaname IN ('public', 'analytics') AND tablename != '_prisma_migrations';`;

		for (const { tablename, schemaname } of tables) {
			if (!tablename || !schemaname) continue;
			try {
				await prisma.$executeRawUnsafe(
					`TRUNCATE TABLE "${schemaname}"."${tablename}" RESTART IDENTITY CASCADE;`,
				);
				console.log(`Truncated table: ${schemaname}.${tablename}`);
			} catch (error) {
				console.error(
					`Failed to truncate table ${schemaname}.${tablename}:`,
					error,
				);
			}
		}
		console.log("Database cleaned successfully.");
	} catch (error) {
		console.error("Error cleaning database:", error);
	}
}

async function main() {
	if (process.env.NODE_ENV === "production") {
		console.error(
			"Refusing to reset database and delete bucket in production environment.",
		);
		return;
	}

	await cleanBuckets();
	// await cleanPolarUsers();
	await cleanDatabase();
}

main()
	.then(async () => {
		// Nothing to disconnect here really, but keeping structure if prisma checks were added.
	})
	.catch(async (e) => {
		console.error(e);
		process.exit(1);
	});
