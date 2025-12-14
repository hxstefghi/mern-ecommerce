import { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useCart();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Shopping Cart - MERN Store';
  }, []);

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
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-32 text-center">
          <h2 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4 text-gray-900 dark:text-white">Your cart is empty</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light mb-8 sm:mb-12">
            Start exploring our collection
          </p>
          <Link
            to="/"
            className="inline-block border border-gray-900 dark:border-gray-700 text-gray-900 dark:text-white px-6 sm:px-8 py-3 hover:bg-gray-900 dark:hover:bg-gray-800 hover:text-white transition-all text-sm font-light tracking-wide"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <h1 className="text-xl sm:text-2xl font-light mb-6 sm:mb-12 text-gray-900 dark:text-white">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b border-gray-100 dark:border-gray-800 pb-6 sm:pb-8"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-24 md:w-32 h-48 sm:h-24 md:h-32 object-cover bg-gray-50 dark:bg-gray-800"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-sm sm:text-base text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 font-light flex-1"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white font-light ml-4 touch-manipulation"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-light mb-2">
                    ${item.price.toFixed(2)} each
                  </p>
                  
                  {/* Stock warning */}
                  {(!item.stock || item.stock === 0) && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-light mb-2">
                      Out of stock - Please remove from cart
                    </p>
                  )}
                  {item.stock > 0 && item.stock < item.quantity && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-light mb-2">
                      Only {item.stock} left in stock
                    </p>
                  )}
                  {item.stock > 0 && item.stock <= 5 && item.stock >= item.quantity && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-light mb-2">
                      Only {item.stock} left in stock
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-light tracking-wide">QTY:</span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="w-9 h-9 sm:w-8 sm:h-8 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-gray-700 active:bg-gray-100 dark:active:bg-gray-800 transition-colors text-sm touch-manipulation flex items-center justify-center dark:text-white"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 1) {
                            updateQuantity(item._id, val);
                          }
                        }}
                        onBlur={(e) => {
                          if (!e.target.value || parseInt(e.target.value) < 1) {
                            updateQuantity(item._id, 1);
                          }
                        }}
                        className="w-14 h-9 sm:h-8 border border-gray-200 dark:border-gray-800 text-center text-sm font-light focus:outline-none focus:border-gray-900 dark:focus:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="w-9 h-9 sm:w-8 sm:h-8 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-gray-700 active:bg-gray-100 dark:active:bg-gray-800 transition-colors text-sm touch-manipulation flex items-center justify-center dark:text-white"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-base font-light text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="border border-gray-100 dark:border-gray-800 p-6 sm:p-8 lg:sticky lg:top-24 dark:bg-gray-900">
              <h2 className="text-base sm:text-lg font-light mb-4 sm:mb-6 text-gray-900 dark:text-white">Summary</h2>
              <div className="space-y-2 sm:space-y-3 mb-6 text-sm font-light">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
                  <div className="flex justify-between text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="block text-center w-full bg-gray-900 dark:bg-gray-800 text-white py-4 hover:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-700 dark:active:bg-gray-600 transition-colors mb-3 text-sm font-light tracking-wide touch-manipulation"
              >
                CHECKOUT
              </button>
              <button
                onClick={clearCart}
                className="w-full border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 py-3 hover:border-gray-900 dark:hover:border-gray-700 hover:text-gray-900 dark:hover:text-white active:bg-gray-50 dark:active:bg-gray-800 transition-colors text-sm font-light touch-manipulation"
              >
                Clear Cart
              </button>
              <Link
                to="/products"
                className="block text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mt-6 font-light"
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
