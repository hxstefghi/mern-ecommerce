import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-light mb-4 text-gray-900">Product not found</h2>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 mb-8 inline-block font-light">
          ← Back
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-8">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover bg-gray-50"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-light mb-4 text-gray-900">{product.name}</h1>
            <p className="text-xl font-light text-gray-900 mb-8">
              ${product.price.toFixed(2)}
            </p>

            <div className="mb-8">
              <h3 className="text-xs text-gray-500 mb-3 font-light tracking-wide">DESCRIPTION</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                {product.description || "A carefully curated product for modern living."}
              </p>
            </div>

            <div className="mb-8">
              <span className="inline-block text-xs text-gray-500 font-light tracking-wide">
                IN STOCK
              </span>
            </div>

            <div className="flex items-center gap-6 mb-12">
              <span className="text-xs text-gray-500 font-light tracking-wide">QUANTITY</span>
              <div className="flex items-center border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 hover:bg-gray-50 transition-colors text-sm"
                >
                  -
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm font-light border-l border-r border-gray-200">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 hover:bg-gray-50 transition-colors text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-gray-900 text-white py-4 hover:bg-gray-800 transition-colors text-sm font-light tracking-wide"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
