import mongoose, { type InferSchemaType } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false, //exclude passwordHash from query results by default
    },
    refreshTokenHash: {
      type: String,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

//Optimize query performance at schema level
userSchema.index({ username: 1 }, { unique: true });

userSchema.methods.setPassword = async function (plain: string) {
  const saltRounds = 12;
  this.passwordHash = await bcrypt.hash(plain, saltRounds);
};

userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash);
};

export type User = InferSchemaType<typeof userSchema> & {
  comparePassword(candidate: string): Promise<boolean>;
  setPassword(plain: string): Promise<void>;
};

export const UserModel = mongoose.model<User>("User", userSchema);
