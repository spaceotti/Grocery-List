import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../../config/env";

export type JwtPayload = {
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
};

export function signAccessToken(payload: { sub: string; role: string }) {
  const secret: Secret = env.JWT_SECRET;

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

export function generateRefreshToken() {
  return crypto.randomBytes(48).toString("hex");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
