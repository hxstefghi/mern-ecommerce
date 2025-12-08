import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid
} from "../controllers/order.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post("/", createOrder);
router.get("/myorders", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/pay", updateOrderToPaid);

export default router;
