import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import morgan from "morgan";

import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import favoritesRoutes from "./routes/favorites";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

const mongoUri = process.env.DATABASE_URL || "";
if (!mongoUri) throw new Error("No Mongo URI found");

mongoose.connect(mongoUri).then(() => console.log("✅ MongoDB connected"));

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health
app.get("/health", (_, res) => res.json({ status: "ok" }));

// Auth middleware
export const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", authMiddleware, cartRoutes);
app.use("/api/favorites", authMiddleware, favoritesRoutes);

// 404
app.use("*", (_, res) => res.status(404).json({ message: "Not found" }));
app.use(errorHandler);

// ❌ Убираем app.listen, потому что Vercel сам создаёт сервер
// ✅ Экспортируем handler для Vercel
export default app;
