import express from "express";
import { getAdminStats, getAdminUsers, updateUserRole, getUserOrders } from "../controllers/adminController.js";
import { getAllOrders, updateOrders } from "../controllers/orderController.js";
import { getProducts } from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleWare.js";

const router = express.Router();

// Apply admin protection to all routes in this file
router.use(protect, adminOnly);

router.get("/stats", getAdminStats);
router.get("/users", getAdminUsers);
router.get("/users/:id/orders", getUserOrders);
router.put("/users/:id/role", updateUserRole);
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrders);
router.put("/orders/:id/status", updateOrders);
router.get("/products", getProducts);

export default router;

