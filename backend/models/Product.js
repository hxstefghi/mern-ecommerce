import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  stock: { type: Number, default: 0 },
  countInStock: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
