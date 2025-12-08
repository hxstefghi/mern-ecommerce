import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import Footer from "../../components/Footer";

export default function OrderDetail() {
  const { id } = useParams();
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrder();
    }
  }, [id, user]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-light">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-gray-500 font-light">Order not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-50";
      case "processing": return "text-blue-600 bg-blue-50";
      case "shipped": return "text-purple-600 bg-purple-50";
      case "delivered": return "text-green-600 bg-green-50";
      case "cancelled": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-light">Order Details</h1>
          <span className={`px-4 py-2 text-sm font-light capitalize ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="space-y-8">
          <div className="border border-gray-200 p-6">
            <h2 className="text-xl font-light mb-4">Order Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-light">
              <div>
                <p className="text-gray-500">Order ID</p>
                <p>{order._id}</p>
              </div>
              <div>
                <p className="text-gray-500">Order Date</p>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p>{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment Status</p>
                <p>{order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : "Not Paid"}</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 p-6">
            <h2 className="text-xl font-light mb-4">Shipping Address</h2>
            <p className="font-light text-sm">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>

          <div className="border border-gray-200 p-6">
            <h2 className="text-xl font-light mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                  <div className="flex-1">
                    <p className="font-light">{item.name}</p>
                    <p className="text-sm font-light text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-light">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 p-6">
            <h2 className="text-xl font-light mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between font-light text-sm">
                <span>Items Price</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-light text-sm">
                <span>Shipping</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-light text-sm">
                <span>Tax</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-light text-lg pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
