import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorMiddleware } from "./middlewares/error.middleware";
import { AppError } from "./shared/errors/AppError";
import { authRouter } from "./modules/auth/auth.routes";
import usersRouter from "./modules/users/users.routes";
import listsRouter from "./modules/lists/lists.routes";

const app = express();

//GLOBAL MIDDLEWARE
//1. Cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

//2. Cookie-parser
app.use(cookieParser());

//3. Body-parser
app.use(express.json({ limit: "10kb" }));

//ROUTES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/lists", listsRouter);

//404 handler
app.use((req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

//GLOBAL ERROR MIDDLEWARE
app.use(errorMiddleware);

export default app;
