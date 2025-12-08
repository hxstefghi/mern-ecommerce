import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block"
    >
      <div className="relative overflow-hidden bg-gray-50 mb-4 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
        />
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 left-4 right-4 bg-white text-gray-900 py-3 text-sm font-light tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          ADD TO CART
        </button>
      </div>
      <div className="space-y-1">
        <h2 className="text-sm text-gray-900 font-light line-clamp-1">
          {product.name}
        </h2>
        <p className="text-sm text-gray-500 font-light">
          P{product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
