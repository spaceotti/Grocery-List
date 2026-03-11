import { UserModel } from "../users/user.model";
import { AppError } from "../../shared/errors/AppError";
import {
  signAccessToken,
  generateRefreshToken,
  hashToken,
} from "../../shared/utils/tokens";

export async function registerUser(input: {
  email: string;
  username?: string;
  password: string;
}) {
  //1. Check if email already in use
  const email = input.email.toLowerCase();
  const exists = await UserModel.findOne({ email });
  if (exists) throw new AppError("Email is already in use", 409);
  //2. Create user document
  const user = new UserModel({
    email,
    username: input.username ?? null,
  });
  //3. Hash password
  await user.setPassword(input.password);
  //4. Create refresh token
  const refreshToken = generateRefreshToken();
  //5. Hash refresh token and save in DB
  user.refreshTokenHash = hashToken(refreshToken);
  //6. Save user
  await user.save();
  //7. Sign access token
  const accessToken = signAccessToken({
    sub: user._id.toString(),
    role: user.role,
  });
  //8. Return user - safe data + tokens
  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

export async function loginUser(input: { email: string; password: string }) {
  //1. Find user
  const email = input.email.toLowerCase();
  const user = await UserModel.findOne({ email }).select(
    "+passwordHash +refreshTokenHash",
  );
  if (!user) throw new AppError("Invalid credentials", 401);
  //2. Check PW
  const ok = await user.comparePassword(input.password);
  if (!ok) throw new AppError("Invalid credentials", 401);
  //3. Refresh token rotation, create new refrech token, and save hash
  const refreshToken = generateRefreshToken();
  user.refreshTokenHash = hashToken(refreshToken);
  //4. Save user
  await user.save();
  //5. Sign access token
  const accessToken = signAccessToken({
    sub: user._id.toString(),
    role: user.role,
  });
  //6. Return user - safe data + tokens
  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    },
    refreshToken,
    accessToken,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const refreshHash = hashToken(refreshToken);

  const user = await UserModel.findOne({
    refreshTokenHash: refreshHash,
  }).select("+refreshTokenHash");
  if (!user) throw new AppError("Invalid refresh token", 401);
  // Rotation
  const newRefreshToken = generateRefreshToken();
  user.refreshTokenHash = hashToken(newRefreshToken);
  await user.save();

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    role: user.role,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    },
  };
}

export async function logoutUser(refreshToken: string) {
  const refreshHash = hashToken(refreshToken);
  await UserModel.updateOne(
    { refreshTokenHash: refreshHash },
    { $set: { refreshTokenHash: null } },
  );
}
