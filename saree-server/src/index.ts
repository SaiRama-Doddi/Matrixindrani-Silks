import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import sareeRoutes from "./routes/sarees";
import { createDefaultAdmin } from "./utils/createDefaultAdmin";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sarees", sareeRoutes);

app.get("/", (req, res) => res.send("Saree API running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await createDefaultAdmin(); // ✅ Automatically create default admin if not exists
});
