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


/* ---------- UPDATE SAREE ---------- *//* ---------- UPDATE SAREE ---------- */
router.put("/:id", authenticateToken, upload.array("images", 3), async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await prisma.saree.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Saree not found" });

    const updates: any = {};

    // Handle text fields
    if (req.body.productName?.trim()) {
      updates.productName = req.body.productName.trim();
    }

    if (req.body.categoryId && req.body.categoryId !== "null") {
      updates.categoryId = req.body.categoryId;
    }

    if (req.body.price) {
      updates.price = parseFloat(req.body.price);
    }

    if (req.body.offerPrice !== undefined) {
      updates.offerPrice = req.body.offerPrice === "" ? null : parseFloat(req.body.offerPrice);
    }

    if (req.body.rating !== undefined) {
      const r = parseFloat(req.body.rating);
      updates.rating = isNaN(r) || req.body.rating === "" ? null : Math.round(r * 10) / 10;
    }

    // Handle image uploads - only update images that are provided
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const files = req.files as Express.Multer.File[];
      
      // Upload new images to Cloudinary
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "sarees",
          });
          return result.secure_url;
        })
      );

      // Assign to specific image slots based on which ones were sent
      // Expecting imageSlots in body like: "0,1,2" or "0" or "1,2"
      const imageSlots = req.body.imageSlots 
        ? req.body.imageSlots.split(',').map((s: string) => parseInt(s.trim()))
        : uploadedUrls.map((_, i) => i);

      uploadedUrls.forEach((url, index) => {
        const slot = imageSlots[index];
        if (slot === 0) updates.image1 = url;
        else if (slot === 1) updates.image2 = url;
        else if (slot === 2) updates.image3 = url;
      });
    }

    // Handle explicit image deletions (if frontend sends deleteImage1, deleteImage2, deleteImage3)
    if (req.body.deleteImage1 === 'true') updates.image1 = null;
    if (req.body.deleteImage2 === 'true') updates.image2 = null;
    if (req.body.deleteImage3 === 'true') updates.image3 = null;

    const updated = await prisma.saree.update({
      where: { id },
      data: updates,
      include: { category: true },
    });

    res.json({ message: "Saree updated successfully", saree: updated });
  } catch (err: any) {
    console.error("Update error:", err.message || err);
    res.status(500).json({ message: "Server error", error: err.message });
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
