import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

  // Prepare chart data
  const orderStatusData = analytics ? [
    { name: "Pending", value: analytics.pendingOrders, color: "#EAB308" },
    { name: "Delivered", value: analytics.deliveredOrders, color: "#22C55E" },
  ] : [];

  const overviewData = analytics ? [
    { name: "Users", count: analytics.totalUsers },
    { name: "Products", count: analytics.totalProducts },
    { name: "Orders", count: analytics.totalOrders },
  ] : [];

  const COLORS = ["#EAB308", "#22C55E"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500 font-light mt-1">
                Welcome back, {user?.name}
              </p>
            </div>
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-900 font-light border border-gray-200 px-4 py-2 hover:border-gray-900 transition-colors"
            >
              View Store
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-sm font-light text-gray-500 uppercase tracking-wide mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/products"
              className="bg-white border border-gray-200 p-6 hover:border-gray-900 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-light text-gray-900">Products</h3>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 font-light">Manage inventory</p>
            </Link>
            <Link
              to="/admin/orders"
              className="bg-white border border-gray-200 p-6 hover:border-gray-900 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-light text-gray-900">Orders</h3>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 font-light">Process orders</p>
            </Link>
            <Link
              to="/admin/users"
              className="bg-white border border-gray-200 p-6 hover:border-gray-900 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-light text-gray-900">Users</h3>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 font-light">Manage accounts</p>
            </Link>
            <Link
              to="/admin/categories"
              className="bg-white border border-gray-200 p-6 hover:border-gray-900 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-light text-gray-900">Categories</h3>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 font-light">Organize catalog</p>
            </Link>
          </div>
        </div>

        {analytics && (
          <>
            {/* Key Metrics */}
            <div className="mb-8">
              <h2 className="text-sm font-light text-gray-500 uppercase tracking-wide mb-4">
                Key Metrics
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-white border border-gray-200 p-6">
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wide mb-2">Revenue</p>
                  <p className="text-2xl font-light text-gray-900">${analytics.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white border border-gray-200 p-6">
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wide mb-2">Orders</p>
                  <p className="text-2xl font-light text-gray-900">{analytics.totalOrders}</p>
                </div>
                <div className="bg-white border border-gray-200 p-6">
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wide mb-2">Users</p>
                  <p className="text-2xl font-light text-gray-900">{analytics.totalUsers}</p>
                </div>
                <div className="bg-white border border-gray-200 p-6">
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wide mb-2">Products</p>
                  <p className="text-2xl font-light text-gray-900">{analytics.totalProducts}</p>
                </div>
                <div className="bg-white border border-gray-200 p-6">
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wide mb-2">Pending</p>
                  <p className="text-2xl font-light text-yellow-600">{analytics.pendingOrders}</p>
                </div>
                <div className="bg-white border border-gray-200 p-6">
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wide mb-2">Delivered</p>
                  <p className="text-2xl font-light text-green-600">{analytics.deliveredOrders}</p>
                </div>
              </div>
            </div>

            {/* Analytics Charts */}
            <div className="mb-8">
              <h2 className="text-sm font-light text-gray-500 uppercase tracking-wide mb-4">
                Analytics
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 p-6">
                  <h3 className="text-sm font-light text-gray-900 mb-6 uppercase tracking-wide">Overview</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={overviewData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "white", 
                          border: "1px solid #e5e7eb",
                          borderRadius: 0,
                          fontSize: 11,
                          fontWeight: 300
                        }} 
                      />
                      <Bar dataKey="count" fill="#111827" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white border border-gray-200 p-6">
                  <h3 className="text-sm font-light text-gray-900 mb-6 uppercase tracking-wide">Order Status</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "white", 
                          border: "1px solid #e5e7eb",
                          borderRadius: 0,
                          fontSize: 11,
                          fontWeight: 300
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
