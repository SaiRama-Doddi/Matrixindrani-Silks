import express from "express";
import { PrismaClient } from "@prisma/client";
import upload from "../middleware/upload";
import { authenticateToken } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";

const router = express.Router();
const prisma = new PrismaClient();

/* ---------- CREATE SAREE ---------- */router.post("/", authenticateToken, upload.array("images", 3), async (req, res) => {
  try {
    const { productName, categoryId, price, offerPrice, rating } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // check if category exists
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const imageUrls = files.map((file) => file.path);

    const saree = await prisma.saree.create({
      data: {
        productName,
        categoryId,
        price: parseFloat(price),
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        rating: rating ? parseFloat(rating) : null,
        image1: imageUrls[0] || null,
        image2: imageUrls[1] || null,
        image3: imageUrls[2] || null,
      },
      include: { category: true },
    });

    res.json({ message: "✅ Saree created successfully", saree });
  } catch (err) {
    console.error("Error creating saree:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ---------- UPDATE SAREE ---------- */
router.put("/:id", authenticateToken, upload.array("images", 3), async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await prisma.saree.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Saree not found" });

    // Handle image uploads
    let images = [existing.image1, existing.image2, existing.image3];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploaded = await Promise.all(
        (req.files as Express.Multer.File[]).map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "sarees",
          });
          return result.secure_url;
        })
      );
      images = uploaded;
    }

    // Prepare update data
    const updates: any = {};

    if (req.body.productName !== undefined && req.body.productName.trim() !== "")
      updates.productName = req.body.productName;

    if (req.body.categoryId !== undefined && req.body.categoryId !== "null")
      updates.categoryId = req.body.categoryId;

    if (req.body.price !== undefined && req.body.price !== "")
      updates.price = parseFloat(req.body.price);

    if (req.body.offerPrice !== undefined && req.body.offerPrice !== "")
      updates.offerPrice = parseFloat(req.body.offerPrice);

    if (req.body.rating !== undefined && req.body.rating !== "") {
      const r = parseFloat(req.body.rating);
      updates.rating = isNaN(r) ? null : Math.round(r * 10) / 10;
    }

    [updates.image1, updates.image2, updates.image3] = images;

    const updated = await prisma.saree.update({
      where: { id },
      data: updates,
      include: { category: true },
    });

    res.json({ message: "✅ Saree updated successfully", saree: updated });
  } catch (err: any) {
    console.error("Update error:", err.message || err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------- DELETE SAREE ---------- */
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const saree = await prisma.saree.findUnique({ where: { id } });
    if (!saree) return res.status(404).json({ message: "Saree not found" });

    const imageUrls = [saree.image1, saree.image2, saree.image3].filter(
      (url): url is string => !!url
    );

    for (const url of imageUrls) {
      try {
        const parts = url.split("/");
        const filename = parts[parts.length - 1];
        const publicId = filename.split(".")[0];
        if (publicId) await cloudinary.uploader.destroy(`sarees/${publicId}`);
      } catch (err: any) {
        console.warn(`⚠️ Could not delete image: ${url}`, err.message);
      }
    }

    await prisma.saree.delete({ where: { id } });
    res.json({ message: "🗑️ Saree deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------- FETCH ALL SAREES ---------- */
router.get("/", async (req, res) => {
  try {
    const sarees = await prisma.saree.findMany({
      include: { category: true }, // ✅ include relation
      orderBy: { createdAt: "desc" },
    });
    res.json({ sarees });
  } catch (err) {
    console.error("Fetch sarees error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ---------- FETCH SINGLE SAREE BY ID ---------- */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const saree = await prisma.saree.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!saree) return res.status(404).json({ message: "Saree not found" });

    res.json({ saree });
  } catch (err) {
    console.error("Fetch saree error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
