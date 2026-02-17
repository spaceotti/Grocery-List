import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";
import { AppError } from "./shared/errors/AppError";

const app = express();

//GLOBAL MIDDLEWARE
//1. Cors
app.use(cors());
//2. Body parser
app.use(express.json({ limit: "10kb" }));

//ROUTES
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

//404 handler
app.use((req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

//GLOBAL ERROR MIDDLEWARE
app.use(errorMiddleware);

export default app;
