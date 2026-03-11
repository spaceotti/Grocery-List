import type { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/errors/AppError";
import { ZodError } from "zod";
import { env } from "../config/env";

function formatZodError(err: ZodError) {
  const flattened = err.flatten();

  return {
    message: "Validation error",
    fieldErrors: flattened.fieldErrors,
    formErrors: flattened.formErrors,
  };
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  //1. Zod validation errors (400)
  if (err instanceof ZodError) {
    const body = formatZodError(err);

    if (env.NODE_ENV !== "production") {
      return res.status(400).json({
        status: "fail",
        ...body,
        issues: err.issues,
      });
    }

    return res.status(400).json({
      status: "fail",
      ...body,
    });
  }
  //l.2 MongoDB duplicate key error
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as any).code === 11000
  ) {
    return res.status(409).json({
      status: "fail",
      message: "Resource already exists",
    });
  }
  if (err instanceof AppError) {
    //2. Operational errors (AppError) -> statusCode + message
    const status =
      err.statusCode >= 400 && err.statusCode < 500 ? "fail" : "error";

    return res.status(err.statusCode).json({
      status,
      message: err.message,
    });
  }
  //3. Programming errors
  if (env.NODE_ENV !== "production") {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      err,
      stack: err instanceof Error ? err.stack : undefined,
    });
  }

  //In production: no details leak
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
}
