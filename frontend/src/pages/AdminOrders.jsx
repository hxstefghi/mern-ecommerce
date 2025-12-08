import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function AdminOrders() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/admin/orders");
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-light">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "text-yellow-600";
      case "processing": return "text-blue-600";
      case "shipped": return "text-purple-600";
      case "delivered": return "text-green-600";
      case "cancelled": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light mb-8">Order Management</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wide">Order ID</p>
                  <p className="font-light mt-1">{order._id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wide">Customer</p>
                  <p className="font-light mt-1">{order.user?.name}</p>
                </div>
                <div>
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wide">Total</p>
                  <p className="font-light mt-1">${order.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wide">Status</p>
                  <p className={`font-light mt-1 capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-light text-gray-500 uppercase tracking-wide mb-2">Items</p>
                {order.orderItems.map((item, index) => (
                  <div key={index} className="font-light text-sm">
                    {item.name} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <p className="text-xs font-light text-gray-500 uppercase tracking-wide mb-2">Shipping Address</p>
                <p className="font-light text-sm">
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <p className="text-xs font-light text-gray-500 uppercase tracking-wide">Update Status:</p>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="px-4 py-2 border border-gray-300 focus:border-black outline-none font-light text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 font-light">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
