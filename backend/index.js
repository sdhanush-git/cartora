import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/authRoutes.js";
import Productrouter from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

connectDB();

app.use("/api/auth", router);
app.use("/api/products", Productrouter);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("I am backend server");
});

app.get("/jsonmsg", (req, res) => {
  res.json({
    json: "hai",
  });
});

app.listen(PORT, () => {
  console.log("Hai i am node js from backend");
});
