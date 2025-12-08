import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function AdminDashboard() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/admin/analytics");
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchAnalytics();
    }
  }, [user]);

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light mb-12">Admin Dashboard</h1>

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="border border-gray-200 p-6">
              <p className="text-sm font-light text-gray-500 uppercase tracking-wide">Total Revenue</p>
              <p className="text-3xl font-light mt-2">${analytics.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="border border-gray-200 p-6">
              <p className="text-sm font-light text-gray-500 uppercase tracking-wide">Total Orders</p>
              <p className="text-3xl font-light mt-2">{analytics.totalOrders}</p>
            </div>
            <div className="border border-gray-200 p-6">
              <p className="text-sm font-light text-gray-500 uppercase tracking-wide">Total Users</p>
              <p className="text-3xl font-light mt-2">{analytics.totalUsers}</p>
            </div>
            <div className="border border-gray-200 p-6">
              <p className="text-sm font-light text-gray-500 uppercase tracking-wide">Total Products</p>
              <p className="text-3xl font-light mt-2">{analytics.totalProducts}</p>
            </div>
            <div className="border border-gray-200 p-6">
              <p className="text-sm font-light text-gray-500 uppercase tracking-wide">Pending Orders</p>
              <p className="text-3xl font-light mt-2">{analytics.pendingOrders}</p>
            </div>
            <div className="border border-gray-200 p-6">
              <p className="text-sm font-light text-gray-500 uppercase tracking-wide">Delivered Orders</p>
              <p className="text-3xl font-light mt-2">{analytics.deliveredOrders}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/products"
            className="border border-gray-200 p-8 hover:border-black transition-colors"
          >
            <h2 className="text-xl font-light mb-2">Products</h2>
            <p className="text-sm font-light text-gray-500">Manage products inventory</p>
          </Link>
          <Link
            to="/admin/orders"
            className="border border-gray-200 p-8 hover:border-black transition-colors"
          >
            <h2 className="text-xl font-light mb-2">Orders</h2>
            <p className="text-sm font-light text-gray-500">View and update orders</p>
          </Link>
          <Link
            to="/admin/users"
            className="border border-gray-200 p-8 hover:border-black transition-colors"
          >
            <h2 className="text-xl font-light mb-2">Users</h2>
            <p className="text-sm font-light text-gray-500">Manage user accounts</p>
          </Link>
          <Link
            to="/admin/categories"
            className="border border-gray-200 p-8 hover:border-black transition-colors"
          >
            <h2 className="text-xl font-light mb-2">Categories</h2>
            <p className="text-sm font-light text-gray-500">Manage product categories</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
