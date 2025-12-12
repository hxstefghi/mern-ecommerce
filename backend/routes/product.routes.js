import express from "express";
import { getProducts, getProductById, addReview, deleteReview } from "../controllers/product.controller.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/:id/reviews", protect, addReview);
router.delete("/:productId/reviews/:reviewId", protect, admin, deleteReview);

export default router;
