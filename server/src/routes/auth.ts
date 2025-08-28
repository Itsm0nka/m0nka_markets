  import express, { Request, Response, NextFunction } from "express";
  import bcrypt from "bcryptjs";
  import jwt from "jsonwebtoken";
  import mongoose, { Document, Model } from "mongoose";
  import { authenticate } from "../middleware/auth";
  import {
    validate,
    loginSchema,
    registerSchema,
  } from "../middleware/validation";

  const router = express.Router();

  interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  }

  const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });

  const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

  router.post(
    "/register",
    validate(registerSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res
            .status(409)
            .json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign(
          { id: user._id.toString(), email: user.email, name: user.name },
          process.env.JWT_SECRET || "",
          { expiresIn: "7d" }
        );

        res.status(201).json({
          data: {
            token,
            user: { id: user._id, name: user.name, email: user.email },
          },
          message: "User registered successfully",
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/login",
    validate(loginSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
          { id: user._id.toString(), email: user.email, name: user.name },
          process.env.JWT_SECRET || "",
          { expiresIn: "7d" }
        );

        res.json({
          data: {
            token,
            user: { id: user._id, name: user.name, email: user.email },
          },
          message: "Login successful",
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    "/profile",
    authenticate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // В middleware authenticate ты должен расширить Request, чтобы в нем был user
        // @ts-expect-error
        const userId = req.user?.id;

        const user = await User.findById(userId).select(
          "id name email createdAt"
        );
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({ data: user });
      } catch (error) {
        next(error);
      }
    }
  );

  export default router;
