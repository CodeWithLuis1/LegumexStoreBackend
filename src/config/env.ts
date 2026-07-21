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
} as const
