import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/AppError";
import { catchAsync } from "../../shared/utils/catchAsync";
import { registerSchema, loginSchema } from "./auth.validation";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "./auth.service";

function setRefreshCookie(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // in production set to true!
    path: "/api/v1/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });
}

export const register = catchAsync(async (req: Request, res: Response) => {
  //1. Validate input (Boundary)
  const parsed = registerSchema.parse(req.body);
  //2. Business logic (service)
  const result = await registerUser({
    email: parsed.email,
    username: parsed.username,
    password: parsed.password,
  });
  //3. Set Refresh Token Cookie
  setRefreshCookie(res, result.refreshToken);
  //4. Return Access Token + user
  res.status(201).json({ user: result.user, accessToken: result.accessToken });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  //1. Validate input
  const parsed = loginSchema.parse(req.body);
  //2. Delegate business logic to the service layer - Service returns "safe" user data + tokens
  const result = await loginUser({
    email: parsed.email,
    password: parsed.password,
  });
  //3. Set refresh token as an httpOnly cookie
  setRefreshCookie(res, result.refreshToken);
  //4. Respond with access token + user data
  res.status(200).json({
    user: result.user,
    accessToken: result.accessToken,
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  //1. Read refresh token from cookie
  const token = req.cookies?.refreshToken as string | undefined;
  //2. If there is no cookie, user is not authenticated for refresh
  if (!token) throw new AppError("Missing refresh token", 401);
  //3. Delegate to service refreshAccessToken
  const result = await refreshAccessToken(token);
  //4. Rotate refresh cookie
  setRefreshCookie(res, result.refreshToken);
  //5. Return new access token + user data
  res.status(200).json({
    user: result.user,
    accessToken: result.accessToken,
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  //1. Read refresh token from cookie
  const token = req.cookies?.refreshToken as string | undefined;
  //2. Remove refresh token from DB
  if (token) await logoutUser(token);
  //3. Clear refresh cookie in the browser - must match the same path used when setting the cookie!
  res.clearCookie("refreshToken", {
    path: "/api/v1/auth/refresh",
  });
  //4. Send response - status: 204
  res.status(204).send();
});
