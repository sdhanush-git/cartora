import express from "express";
import {
  createOrder,
  getMyOrders,
  getMyOrder,
  getAllOrders,
  updateOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/myorders/:id", protect, getMyOrders);
router.get("/myorder/:id", protect, getMyOrder);
router.get("/allorders", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrders);

export default router;
