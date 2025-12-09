import { useState } from "react";
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
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-light mb-8">Checkout</h1>
          <p className="text-gray-500 font-light">Your cart is empty.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const shippingPrice = 10;
  const taxPrice = cartTotal * 0.1;
  const totalPrice = cartTotal + shippingPrice + taxPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        totalPrice
      };

      const { data } = await api.post("/orders", orderData);
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/orders/${data._id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-light">Shipping Information</h2>
                  {user?.address?.street && (
                    <Link
                      to="/profile"
                      className="text-sm font-light text-gray-600 hover:text-gray-900 underline"
                    >
                      Edit Address
                    </Link>
                  )}
                </div>
                
                {user?.address?.street ? (
                  <div className="p-6 bg-gray-50 border border-gray-200">
                    <p className="text-sm font-light text-gray-900 mb-2">{user.address.street}</p>
                    <p className="text-sm font-light text-gray-900 mb-2">
                      {user.address.city}, {user.address.state} {user.address.zipCode}
                    </p>
                    <p className="text-sm font-light text-gray-900">{user.address.country}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:border-black outline-none font-light"
                      required
                    />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:border-black outline-none font-light"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:border-black outline-none font-light"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Zip Code"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:border-black outline-none font-light"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:border-black outline-none font-light"
                      required
                    />
                  </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-light mb-6">Payment Method</h2>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black outline-none font-light"
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
                className="w-full px-8 py-4 bg-black text-white font-light text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          <div>
            <div className="border border-gray-200 p-6">
              <h2 className="text-2xl font-light mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between font-light text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between font-light text-sm">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-light text-sm">
                  <span>Shipping</span>
                  <span>${shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-light text-sm">
                  <span>Tax (10%)</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-light text-lg pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
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
