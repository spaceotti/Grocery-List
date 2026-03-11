import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync";
import { AppError } from "../../shared/errors/AppError";
import { getCurrentUser } from "./users.service";

export const me = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await getCurrentUser(req.user.id);

  res.status(200).json({
    user,
  });
});
