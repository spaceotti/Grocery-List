import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

// Load .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Define schema for environment variables
const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  MONGO_URI: z.string().min(1, "MONGO_URI is required"),

  JWT_SECRET: z.string().min(20, "JWT_SECRET must be at least 20 characters"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
});

// Validate process.env
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsedEnv.error.format());
  process.exit(1);
}

// Export typed env object
export const env = parsedEnv.data;
