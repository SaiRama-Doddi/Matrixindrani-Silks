// src/routes/category.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();
const prisma: any = new PrismaClient();

/* ---------- CREATE CATEGORY ---------- */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) return res.status(409).json({ message: "Category already exists" });

    const category = await prisma.category.create({
      data: { name },
    });

    res.json({ message: "✅ Category created successfully", category });
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------- UPDATE CATEGORY ---------- */
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: "Category name is required" });

  try {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Category not found" });

    const updated = await prisma.category.update({
      where: { id },
      data: { name },
    });

    res.json({ message: "✅ Category updated successfully", updated });
  } catch (err) {
    console.error("Update category error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------- DELETE CATEGORY ---------- */
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Optional: unlink sarees from this category
    await prisma.saree.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    await prisma.category.delete({ where: { id } });

    res.json({ message: "🗑️ Category deleted successfully" });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------- GET ALL CATEGORIES ---------- */
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ categories });
  } catch (err) {
    console.error("Fetch categories error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
