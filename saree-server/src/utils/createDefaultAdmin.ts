import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load .env variables

const prisma = new PrismaClient();

export const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL!;
    const adminPassword = process.env.ADMIN_PASSWORD!;

    if (!adminEmail || !adminPassword) {
      console.error("❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
      return;
    }

    const existing = await prisma.adminUser.findUnique({
      where: { email: adminEmail },
    });

    if (!existing) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      await prisma.adminUser.create({
        data: {
          email: adminEmail,
          passwordHash: hashed,
          fullName: "Default Admin",
        },
      });
      console.log(`✅ Default admin created: ${adminEmail}`);
      console.log("📩 Admin from .env:", adminEmail, adminPassword);

    } else {
      console.log("ℹ️ Default admin already exists");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error);
  } finally {
    await prisma.$disconnect();
  }
};
