import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const isOutOfStock = !product.stock || product.stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product);
      toast.success("Item added to cart!");
    }
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block"
    >
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 mb-4 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 text-sm font-light">OUT OF STOCK</span>
          </div>
        )}
        {!isOutOfStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-3 text-sm font-light tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            ADD TO CART
          </button>
        )}
      </div>
      <div className="space-y-1">
        <h2 className="text-sm text-gray-900 dark:text-white font-light line-clamp-1">
          {product.name}
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
            P{product.price.toFixed(2)}
          </p>
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-yellow-500 dark:text-yellow-400">★</span>
              <span className="text-gray-500 dark:text-gray-400 font-light">{product.rating.toFixed(1)}</span>
              <span className="text-gray-400 dark:text-gray-500 font-light">({product.numReviews})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
