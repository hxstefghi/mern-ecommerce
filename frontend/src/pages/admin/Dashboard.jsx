import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/AdminLayout";
import api from "../../lib/api";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-light text-gray-900 dark:text-white mb-6 sm:mb-8">Dashboard</h2>

          {analytics && (
            <>
              {/* Key Metrics */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                  Key Metrics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                    <p className="text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Revenue
                    </p>
                    <p className="text-lg sm:text-2xl font-light text-gray-900 dark:text-white">
                      ${analytics.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                    <p className="text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Orders
                    </p>
                    <p className="text-lg sm:text-2xl font-light text-gray-900 dark:text-white">
                      {analytics.totalOrders}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                    <p className="text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Users
                    </p>
                    <p className="text-lg sm:text-2xl font-light text-gray-900 dark:text-white">
                      {analytics.totalUsers}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                    <p className="text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Products
                    </p>
                    <p className="text-lg sm:text-2xl font-light text-gray-900 dark:text-white">
                      {analytics.totalProducts}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                    <p className="text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Pending
                    </p>
                    <p className="text-lg sm:text-2xl font-light text-yellow-600 dark:text-yellow-500">
                      {analytics.pendingOrders}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                    <p className="text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Delivered
                    </p>
                    <p className="text-lg sm:text-2xl font-light text-green-600 dark:text-green-500">
                      {analytics.deliveredOrders}
                    </p>
                  </div>
                </div>
              </div>

              {/* Daily Sales Chart */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                  Daily Sales (Last 7 Days)
                </h3>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.dailySales}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f3f4f6"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="_id"
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(17, 24, 39, 0.95)",
                          border: "1px solid #374151",
                          borderRadius: 0,
                          fontSize: 11,
                          fontWeight: 300,
                          color: "#fff",
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          fontSize: 11,
                          fontWeight: 300,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6", r: 4 }}
                        name="Sales ($)"
                      />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ fill: "#8b5cf6", r: 4 }}
                        name="Orders"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                  Top Selling Products
                </h3>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="border-b border-gray-200 dark:border-gray-800">
                        <tr>
                          <th className="text-left py-3 px-4 sm:px-6 text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Product
                          </th>
                          <th className="text-right py-3 px-4 sm:px-6 text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Units Sold
                          </th>
                          <th className="text-right py-3 px-4 sm:px-6 text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.topProducts && analytics.topProducts.length > 0 ? (
                          analytics.topProducts.map((product, index) => (
                            <tr key={index} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                              <td className="py-3 px-4 sm:px-6 text-sm font-light text-gray-900 dark:text-gray-300">
                                {product.name}
                              </td>
                              <td className="py-3 px-4 sm:px-6 text-sm font-light text-gray-900 dark:text-gray-300 text-right">
                                {product.totalSold}
                              </td>
                              <td className="py-3 px-4 sm:px-6 text-sm font-light text-gray-900 dark:text-gray-300 text-right">
                                ${product.revenue.toFixed(2)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="py-6 px-4 sm:px-6 text-center text-sm font-light text-gray-400 dark:text-gray-500">
                              No sales data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Analytics Charts */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                  Analytics
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                    <h4 className="text-sm font-light text-gray-900 dark:text-white mb-4 sm:mb-6 uppercase tracking-wide">
                      Overview
                    </h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={overviewData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#374151"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: "#d1d5db" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#d1d5db" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(17, 24, 39, 0.95)",
                            border: "1px solid #374151",
                            borderRadius: 0,
                            fontSize: 11,
                            fontWeight: 300,
                            color: "#fff",
                          }}
                        />
                        <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                    <h4 className="text-sm font-light text-gray-900 dark:text-white mb-4 sm:mb-6 uppercase tracking-wide">
                      Order Status
                    </h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
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
                            backgroundColor: "rgba(17, 24, 39, 0.95)",
                            border: "1px solid #374151",
                            borderRadius: 0,
                            fontSize: 11,
                            fontWeight: 300,
                            color: "#fff",
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
    </AdminLayout>
  );
}
