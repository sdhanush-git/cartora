import express from "express";
import {
  createOrder,
  getMyOrders,
  getMyOrder,
  getAllOrders,
  updateOrders,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, adminOnly, getAllOrders);
router.get("/myorders", protect, getMyOrders);
router.get("/myorders/:id", protect, getMyOrders);
router.get("/myorder/:id", protect, getMyOrder);
router.get("/allorders", protect, adminOnly, getAllOrders);
router.get("/:id", protect, getMyOrder);
router.put("/:id", protect, adminOnly, updateOrders);
router.put("/:id/status", protect, adminOnly, updateOrders);


export default router;
