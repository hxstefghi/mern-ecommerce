import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import api from "../../lib/api";
import Footer from "../../components/Footer";

export default function Checkout() {
  const { user, refreshUser } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Checkout';
  }, []);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    paymentMethod: "PayPal"
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-light mb-8 dark:text-white">Checkout</h1>
          <p className="text-gray-500 dark:text-gray-400 font-light">Your cart is empty.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const shippingPrice = 10;
  const discountAmount = appliedCoupon ? (cartTotal * appliedCoupon.discount) / 100 : 0;
  const subtotalAfterDiscount = cartTotal - discountAmount;
  const taxPrice = subtotalAfterDiscount * 0.1;
  const totalPrice = subtotalAfterDiscount + shippingPrice + taxPrice;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      setApplyingCoupon(true);
      const { data } = await api.post('/coupons/validate', { code: couponCode });
      setAppliedCoupon(data);
      toast.success(`Coupon applied! ${data.discount}% discount`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if any items are out of stock
    const outOfStockItems = cart.filter(item => !item.stock || item.stock === 0 || item.stock < item.quantity);
    if (outOfStockItems.length > 0) {
      toast.error(`Some items are out of stock or have insufficient quantity. Please remove them from cart.`);
      return;
    }
    
    setLoading(true);

    try {
      let shippingAddress;
      
      // If user has saved address, use it
      if (user?.address?.street) {
        shippingAddress = user.address;
      } else {
        // If user doesn't have saved address, use form data and save it
        shippingAddress = {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        };
        
        // Save address to user profile
        try {
          await api.put("/auth/profile", { address: shippingAddress });
          await refreshUser();
        } catch (err) {
          console.error("Failed to save address:", err);
          // Continue with order even if address save fails
        }
      }

      const orderData = {
        orderItems: cart.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price
        })),
        shippingAddress,
        paymentMethod: formData.paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice,
        taxPrice,
        totalPrice,
        ...(appliedCoupon && {
          coupon: appliedCoupon.code,
          discount: discountAmount
        })
      };

      const { data } = await api.post("/orders", orderData);
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/orders/${data._id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(error.response?.data?.message || "Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light mb-12 dark:text-white">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-light dark:text-white">Shipping Information</h2>
                  {user?.address?.street && (
                    <Link
                      to="/profile"
                      className="text-sm font-light text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline"
                    >
                      Edit Address
                    </Link>
                  )}
                </div>
                
                {user?.address?.street ? (
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-light text-gray-900 dark:text-gray-300 mb-2">{user.address.street}</p>
                    <p className="text-sm font-light text-gray-900 dark:text-gray-300 mb-2">
                      {user.address.city}, {user.address.state} {user.address.zipCode}
                    </p>
                    <p className="text-sm font-light text-gray-900 dark:text-gray-300">{user.address.country}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-4 py-3 border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none font-light dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none font-light dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none font-light dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Zip Code"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-4 py-3 border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none font-light dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none font-light dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-light mb-6 dark:text-white">Payment Method</h2>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none font-light dark:bg-gray-800 dark:text-white"
                  required
                >
                  <option value="PayPal">PayPal</option>
                  <option value="Stripe">Stripe</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-light text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          <div>
            <div className="border border-gray-200 dark:border-gray-800 p-6 dark:bg-gray-900">
              <h2 className="text-2xl font-light mb-6 dark:text-white">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between font-light text-sm dark:text-gray-300">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-4">
                {/* Coupon Code Section */}
                <div className="space-y-2">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 font-light tracking-wide">COUPON CODE</label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div>
                        <p className="text-sm font-light text-green-800 dark:text-green-400">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-600 dark:text-green-500">{appliedCoupon.discount}% discount applied</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-light"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 font-light text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon}
                        className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black font-light text-sm hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-400 dark:disabled:bg-gray-600"
                      >
                        {applyingCoupon ? 'Checking...' : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between font-light text-sm dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>₱{cartTotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between font-light text-sm text-green-600 dark:text-green-500">
                      <span>Discount ({appliedCoupon.discount}%)</span>
                      <span>-₱{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-light text-sm dark:text-gray-300">
                    <span>Shipping</span>
                    <span>₱{shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-light text-sm dark:text-gray-300">
                    <span>Tax (10%)</span>
                    <span>₱{taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-light text-lg pt-4 border-t border-gray-200 dark:border-gray-800 dark:text-white">
                    <span>Total</span>
                    <span>₱{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
