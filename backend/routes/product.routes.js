import express from "express";
import { getProducts, getProductById, addReview } from "../controllers/product.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/:id/reviews", protect, addReview);

export default router;
