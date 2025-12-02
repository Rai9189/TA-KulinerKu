import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import restaurantRoutes from "./routes/restaurants";
import menuRoutes from "./routes/menu";
import reviewRoutes from "./routes/review";
import userRoutes from "./routes/users";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Public routes (Guest boleh akses)
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/reviews", reviewRoutes);

// Admin-only access
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "KulinerKu API is running" });
});

app.get("/", (req, res) => {
  res.send("KulinerKu API is running...");
});

// ✅ TAMBAHKAN INI - Start server hanya untuk local development
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// ✅ TAMBAHKAN INI - Export untuk Vercel
export default app;