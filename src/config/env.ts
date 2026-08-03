import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, ".env") })

function getRequiredEnv(key: string): string {
    const value = process.env[key]
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
    return value
}

export const env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    serverPort: Number(process.env.SERVER_PORT) || 3000,
    databaseUrl: getRequiredEnv("DATABASE_URL"),
    dbSyncAlter: process.env.DB_SYNC_ALTER === "true",
    jwtSecret: getRequiredEnv("JWT_SECRET"),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
    seedAdminUsername: process.env.SEED_ADMIN_USERNAME,
    seedAdminPassword: process.env.SEED_ADMIN_PASSWORD,
    awsRegion: getRequiredEnv("AWS_REGION"),
    awsAccessKeyId: getRequiredEnv("AWS_ACCESS_KEY_ID"),
    awsSecretAccessKey: getRequiredEnv("AWS_SECRET_ACCESS_KEY"),
    awsS3BucketName: getRequiredEnv("AWS_S3_BUCKET_NAME"),
} as const
