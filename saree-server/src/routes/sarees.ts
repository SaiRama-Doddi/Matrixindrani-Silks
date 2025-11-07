import express from "express";
import { PrismaClient } from "@prisma/client";
import upload from "../middleware/upload";
import { authenticateToken } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";


const router = express.Router();
const prisma = new PrismaClient();

router.post("/", authenticateToken, upload.array("images", 3), async (req, res) => {
  try {
    const { productName, category, price, offerPrice, rating } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image." });
    }

    const imageUrls = files.map((file) => file.path); // each .path is a unique Cloudinary URL

    const saree = await prisma.saree.create({
      data: {
        productName,
        category,
        price: parseFloat(price),
        offerPrice: parseFloat(offerPrice),
        rating: parseFloat(rating),
        image1: imageUrls[0] || null,
        image2: imageUrls[1] || null,
        image3: imageUrls[2] || null,
      },
    });

    res.json({ message: "✅ Saree created successfully", saree });
  } catch (err) {
    console.error("Error creating saree:", err);
    res.status(500).json({ message: "Server error" });
  }
});





/* ---------- UPDATE (PUT) A SAREE ---------- */
router.put("/:id", authenticateToken, upload.array("images", 3), async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await prisma.saree.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Saree not found" });

    // Handle images
    let images = [existing.image1, existing.image2, existing.image3];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploaded = (req.files as Express.Multer.File[]).map((f) => f.path);
      images = uploaded;
    }

    const updates: any = {};
    if (req.body.productName !== undefined) updates.productName = req.body.productName;
    if (req.body.category !== undefined) updates.category = req.body.category;
    if (req.body.price !== undefined) updates.price = parseFloat(req.body.price);
    if (req.body.offerPrice !== undefined) updates.offerPrice = parseFloat(req.body.offerPrice);
if (req.body.rating !== undefined) {
  const r = parseFloat(req.body.rating);
  updates.rating = Math.round(r * 10) / 10; // round to 1 decimal place
}


    [updates.image1, updates.image2, updates.image3] = images;

    const updated = await prisma.saree.update({
      where: { id },
      data: updates,
    });

    res.json({ message: "✅ Saree updated successfully", updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ---------- DELETE A SAREE ---------- */
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const saree = await prisma.saree.findUnique({ where: { id } });
    if (!saree) return res.status(404).json({ message: "Saree not found" });

    // ✅ Only take non-null image URLs
    const imageUrls = [saree.image1, saree.image2, saree.image3].filter(
      (url): url is string => !!url
    );

    for (const url of imageUrls) {
      try {
        // extract Cloudinary public ID safely
        const parts = url.split("/");
        const filename = parts[parts.length - 1];
        const publicId = filename.split(".")[0];

        if (publicId) {
          await cloudinary.uploader.destroy(`sarees/${publicId}`);
        }
      } catch (err: any) {
        console.warn(`⚠️ Could not delete image: ${url}`, err.message);
      }
    }

    // delete from NeonDB
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
    const { category, productName } = req.query;

    const sarees = await prisma.saree.findMany({
      where: {
        AND: [
          // Filter by related category name
          category ? { category: { name: { contains: String(category), mode: "insensitive" } } } : {},
          productName ? { productName: { contains: String(productName), mode: "insensitive" } } : {},
        ],
      },
      include: { category: true }, // Include category data
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
    const saree = await prisma.saree.findUnique({ where: { id } });
    if (!saree) return res.status(404).json({ message: "Saree not found" });

    res.json({ saree });
  } catch (err) {
    console.error("Fetch saree error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ---------- FETCH ALL SAREES ---------- */
router.get("/", async (req, res) => {
  try {
    const sarees = await prisma.saree.findMany({
      orderBy: {
        createdAt: "desc", // latest first
      },
    });

    res.json(sarees);
  } catch (err) {
    console.error("Fetch all sarees error:", err);
    res.status(500).json({ message: "Server error" });
  }
});




export default router;
