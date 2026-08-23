import z from "zod";

const envSchema = z.object({
	// Database
	DATABASE_URL: z.string(),
	DIRECT_URL: z.string().optional(),

	// App
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
	NEXT_PUBLIC_APP_URL: z.string().optional().default("http://localhost:3000"),

	// Better Auth
	BETTER_AUTH_SECRET: z.string().optional(),
	BETTER_AUTH_URL: z.string().optional().default("http://localhost:3000"),

	// Storage (Minio/S3/AWS) - make them optional group or individual
	MINIO_PORT: z.string().optional(),
	MINIO_CONSOLE_PORT: z.string().optional(),
	MINIO_ROOT_USER: z.string(),
	MINIO_ROOT_PASSWORD: z.string(),
	MINIO_SERVER_URL: z.string().optional(),
	MINIO_USE_SSL: z.string().optional(),
	MINIO_BROWSER_REDIRECT_URL: z.string().optional(),
	MINIO_REGION: z.string(),
	MINIO_BUCKET_NAME: z.string(),

	AWS_ACCESS_KEY_ID: z.string().optional(),
	AWS_SECRET_ACCESS_KEY: z.string().optional(),
	AWS_REGION: z.string().optional().default("us-east-1"),
	AWS_S3_BUCKET: z.string().optional(),

	INNGEST_DEV: z.string().optional(),
	INNGEST_EVENT_KEY: z.string().optional(),
	INNGEST_SIGNING_KEY: z.string().optional(),

	DEEPSEEK_API_KEY: z.string().optional(),
	DEEPSEEK_MODEL: z.string().optional().default("deepseek-v4-pro"),
	MCP_SERVER_URL: z.string().optional().default("http://localhost:3333/mcp"),
	AMIN_EMAILS: z.string().optional().default(""),
});

// Parse and validate
const parsedEnv = envSchema.parse(process.env);

// Config object
const config = {
	databaseUrl: parsedEnv.DATABASE_URL,
	directUrl: parsedEnv.DIRECT_URL,

	nodeEnv: parsedEnv.NODE_ENV,

	nextPublicAppUrl: parsedEnv.NEXT_PUBLIC_APP_URL,

	betterAuth: {
		secret: parsedEnv.BETTER_AUTH_SECRET,
		url: parsedEnv.BETTER_AUTH_URL,
	},

	minio: {
		port: Number(parsedEnv.MINIO_PORT) || undefined,
		consolePort: Number(parsedEnv.MINIO_CONSOLE_PORT) || 9001,
		rootUser: parsedEnv.MINIO_ROOT_USER,
		rootPassword: parsedEnv.MINIO_ROOT_PASSWORD,
		serverUrl: parsedEnv.MINIO_SERVER_URL || "localhost",
		useSsl: parsedEnv.MINIO_USE_SSL === "true",
		browserRedirectUrl: parsedEnv.MINIO_BROWSER_REDIRECT_URL,
		region: parsedEnv.MINIO_REGION || "us-east-1",
		bucketName: parsedEnv.MINIO_BUCKET_NAME,
	},

	aws: {
		accessKeyId: parsedEnv.AWS_ACCESS_KEY_ID,
		secretAccessKey: parsedEnv.AWS_SECRET_ACCESS_KEY,
		region: parsedEnv.AWS_REGION || "us-east-1",
		bucketName: parsedEnv.AWS_S3_BUCKET,
	},

	inngest: {
		dev: parsedEnv.INNGEST_DEV,
		eventKey: parsedEnv.INNGEST_EVENT_KEY,
		signingKey: parsedEnv.INNGEST_SIGNING_KEY,
	},

	deepseekApiKey: parsedEnv.DEEPSEEK_API_KEY,
	deepseekModel: parsedEnv.DEEPSEEK_MODEL,
	mcpServerUrl: parsedEnv.MCP_SERVER_URL,
	adminEmails: parsedEnv.AMIN_EMAILS.split(",")
		.map((email) => email.trim().toLowerCase())
		.filter(Boolean),
};

export default config;
