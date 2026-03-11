import { email } from "zod";
import { AppError } from "../../shared/errors/AppError";
import { UserModel } from "./user.model";

export async function getCurrentUser(userId: string) {
  const user = await UserModel.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  return {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    role: user.role,
  };
}
