import * as Minio from "minio";
import config from "./config";

const s3Client = new Minio.Client({
	endPoint: config.minio.serverUrl,
	port: config.minio.port,
	useSSL: config.minio.useSsl,
	accessKey: config.minio.rootUser,
	secretKey: config.minio.rootPassword,
});

export default s3Client;
