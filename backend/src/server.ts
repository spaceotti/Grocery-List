import app from "./app";
import { env } from "./config/env";
import { connectDb } from "./config/db";

let server: ReturnType<typeof app.listen> | null = null;

//START MONGODB AND SERVER
async function bootstrap() {
  await connectDb(env.MONGO_URI);

  server = app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("❌ Fatal startup error:", err);
  process.exit(1);
});

//Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  if (server) server.close(() => process.exit(0));
  else process.exit(0);
});

// Handle unexpected errors
process.on("unhandledRejection", (reason) => {
  console.error("❌ UNHANDLED REJECTION:", reason);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});
