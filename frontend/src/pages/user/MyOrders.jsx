import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import Footer from "../../components/Footer";

export default function MyOrders() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-light">Loading...</div>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-light mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-black text-white font-light hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="block border border-gray-200 p-6 hover:border-black transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs font-light text-gray-500 uppercase tracking-wide">Order ID</p>
                    <p className="font-light">{order._id.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-light text-gray-500 uppercase tracking-wide">Date</p>
                    <p className="font-light">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-light text-gray-500 uppercase tracking-wide">Total</p>
                    <p className="font-light">${order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className={`px-4 py-2 text-sm font-light capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wide mb-2">Items</p>
                  <div className="flex flex-wrap gap-2">
                    {order.orderItems.map((item, index) => (
                      <span key={index} className="text-sm font-light text-gray-600">
                        {item.name} x {item.quantity}
                        {index < order.orderItems.length - 1 && ","}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
