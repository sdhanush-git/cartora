import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import router from "./routes/authRoutes.js";
import Productrouter from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

connectDB();

app.use("/api/auth", router);
app.use("/api/products", Productrouter);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("I am backend server");
});

app.get("/api/health", (req, res) => {
  const stateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  const dbStatus = stateMap[mongoose.connection.readyState] || "unknown";
  res.json({
    status: "ok",
    database: dbStatus,
    mongoConnected: mongoose.connection.readyState === 1,
    uptime: process.uptime(),
  });
});

app.get("/jsonmsg", (req, res) => {
  res.json({
    json: "hai",
  });
});

app.listen(PORT, () => {
  console.log("Hai i am node js from backend");
});
