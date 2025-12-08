import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAnalytics
} from "../controllers/admin.controller.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, admin);

// User management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Product management
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Order management
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

// Category management
router.get("/categories", getAllCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Analytics
router.get("/analytics", getAnalytics);

export default router;
