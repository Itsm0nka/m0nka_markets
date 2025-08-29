import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import favoritesRoutes from "./routes/favorites";
import checkoutRoutes from "./routes/checkout";
import { errorHandler } from "./middleware/errorHandler";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Подключение к MongoDB
const mongoUri = process.env.MONGO_URI || process.env.DATABASE_URL;
if (!mongoUri) {
    throw new Error("❌ No MongoDB URI found in .env (expected MONGO_URI or DATABASE_URL)");
}
mongoose
    .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log(`✅ MongoDB connected (${process.env.MONGO_URI ? "MONGO_URI" : "DATABASE_URL"})`))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/checkout", checkoutRoutes);
// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// Error handling middleware
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
export default app;
