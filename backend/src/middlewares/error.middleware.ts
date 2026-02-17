import type { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/errors/AppError";
import { env } from "../config/env";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const isAppError = err instanceof AppError;

  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : "Internal Server Error";

  if (env.NODE_ENV !== "production") {
    return res.status(statusCode).json({
      status: "error",
      message,
      err,
      //ts-expect-error stack exists on Error-like objects
      stack: (err as any)?.stack,
    });
  }

  // production: keine internen Details leaken
  return res.status(statusCode).json({
    status: "error",
    message,
  });
}
