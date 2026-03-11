/**
 * Wrapper for async route handlers.
 *
 * Note:
 * In Express 5, async errors are automatically forwarded to the
 * error middleware. Therefore this wrapper is technically not required.
 *
 * We keep it for:
 * - consistency across controllers
 * - explicit async boundary
 * - compatibility with older Express versions
 */

import type { Request, Response, NextFunction, RequestHandler } from "express";

export const catchAsync =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
  ): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
