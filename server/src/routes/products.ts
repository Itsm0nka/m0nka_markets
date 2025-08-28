import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Схема продукта
const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    discountPrice: Number,
    category: String,
    images: [String],
    rating: Number,
    reviewCount: Number,
    inStock: Boolean,
    specifications: Object,
    installmentMonths: Number,
  },
  { timestamps: true }
);

// Явно указываем имя коллекции "Product"
const Product = mongoose.model("Product", productSchema, "Product");

// Получение списка продуктов с фильтром, пагинацией и сортировкой
router.get("/", async (req, res, next) => {
  try {
    const {
      q = "",
      category = "",
      page = "1",
      limit = "40",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Валидируем page и limit
    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit as string, 10) || 40, 1);
    const skip = (pageNum - 1) * limitNum;

    // Формируем фильтр
    const filter: Record<string, any> = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q as string, $options: "i" } },
        { description: { $regex: q as string, $options: "i" } },
      ];
    }
    if (category) filter.category = category;

    // Сортировка
    const sortField = sortBy && typeof sortBy === "string" ? sortBy : "createdAt";
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // Получаем данные и общее количество
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);
    res.json({
      data: products,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
});

export default router;
