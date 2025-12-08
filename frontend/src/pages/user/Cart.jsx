import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to proceed with checkout");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-32 text-center">
          <h2 className="text-2xl font-light mb-4 text-gray-900">Your cart is empty</h2>
          <p className="text-sm text-gray-500 font-light mb-12">
            Start exploring our collection
          </p>
          <Link
            to="/"
            className="inline-block border border-gray-900 text-gray-900 px-8 py-3 hover:bg-gray-900 hover:text-white transition-all text-sm font-light tracking-wide"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-light mb-12 text-gray-900">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex gap-6 border-b border-gray-100 pb-8"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-cover bg-gray-50"
                />
                <div className="flex-1">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-sm text-gray-900 hover:text-gray-600 font-light block mb-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500 font-light mb-4">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      className="w-8 h-8 border border-gray-200 hover:border-gray-900 transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm font-light">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="w-8 h-8 border border-gray-200 hover:border-gray-900 transition-colors text-sm"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-xs text-gray-500 hover:text-gray-900 font-light ml-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-light text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="border border-gray-100 p-8 sticky top-24">
              <h2 className="text-lg font-light mb-6 text-gray-900">Summary</h2>
              <div className="space-y-3 mb-6 text-sm font-light">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between text-gray-900">
                    <span>Total</span>
                    <span>
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="block text-center w-full bg-gray-900 text-white py-4 hover:bg-gray-800 transition-colors mb-3 text-sm font-light tracking-wide"
              >
                CHECKOUT
              </button>
              <button
                onClick={clearCart}
                className="w-full border border-gray-200 text-gray-600 py-3 hover:border-gray-900 hover:text-gray-900 transition-colors text-sm font-light"
              >
                Clear Cart
              </button>
              <Link
                to="/"
                className="block text-center text-sm text-gray-500 hover:text-gray-900 mt-6 font-light"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
