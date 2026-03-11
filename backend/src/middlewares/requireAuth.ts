import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../shared/utils/tokens";
import { AppError } from "../shared/errors/AppError";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  //1. Extract Bearer token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }
  const token = authHeader.split(" ")[1];
  //2. Verify the JWT
  try {
    const payload = verifyAccessToken(token);
    //3. Attach user to request
    req.user = {
      id: payload.sub,
      role: payload.role,
    };
    // 4. Continue middleware chain
    next();
  } catch {
    // Token invalid or expired
    return next(new AppError("Invalid or expired token", 401));
  }
}
