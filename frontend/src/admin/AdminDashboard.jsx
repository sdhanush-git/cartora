import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  Users,
  Package,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Cartora | Admin Dashboard";
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load statistics.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-64 rounded bg-gray-100 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="rounded-2xl border border-gray-200 bg-white p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-3 w-20 rounded bg-gray-200" />
                  <div className="h-5 w-16 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      name: "Total Revenue",
      value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`,
      sub: "Excluding cancelled orders",
      icon: IndianRupee,
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      name: "Total Orders",
      value: stats.totalOrders || 0,
      sub: `${stats.pendingOrders || 0} pending`,
      icon: ShoppingBag,
      color: "text-blue-700 bg-blue-50",
    },
    {
      name: "Total Products",
      value: stats.totalProducts || 0,
      sub: `${stats.activeProducts || 0} active`,
      icon: Package,
      color: "text-purple-700 bg-purple-50",
    },
    {
      name: "Total Users",
      value: stats.totalUsers || 0,
      sub: "Registered accounts",
      icon: Users,
      color: "text-amber-700 bg-amber-50",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Store performance metrics, inventory alerts, and recent customer orders.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-xs"
          >
            <div className="flex items-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 truncate">
                  {stat.name}
                </p>
                <p className="mt-0.5 text-2xl font-bold text-gray-950 truncate">
                  {stat.value}
                </p>
                <p className="text-[11px] text-gray-400 truncate">{stat.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Highlights: Status Breakdown & Low Stock */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Status Breakdown */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs lg:col-span-1">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
              Orders by Status
            </h2>
            <Clock size={16} className="text-gray-400" />
          </div>

          <div className="mt-4 space-y-2.5">
            {["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map(
              (st) => {
                const count = stats.statusBreakdown?.[st] || 0;
                return (
                  <div
                    key={st}
                    className="flex items-center justify-between rounded-xl bg-gray-50 px-3.5 py-2 text-xs"
                  >
                    <span className="font-medium text-gray-700">{st}</span>
                    <span className="rounded-full bg-white px-2.5 py-0.5 font-bold text-gray-900 border border-gray-200">
                      {count}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
                Low Stock Alert ({stats.lowStockProducts || 0})
              </h2>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-gray-900 hover:underline flex items-center gap-1"
            >
              View all products <ArrowRight size={13} />
            </Link>
          </div>

          {(!stats.lowStockList || stats.lowStockList.length === 0) ? (
            <div className="py-8 text-center text-xs text-gray-400">
              All inventory levels are healthy. No items under 5 units.
            </div>
          ) : (
            <div className="mt-4 divide-y divide-gray-100">
              {stats.lowStockList.map((prod) => (
                <div
                  key={prod._id}
                  className="flex items-center justify-between py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-10 w-10 rounded-lg object-cover bg-gray-50 border border-gray-200"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{prod.name}</p>
                      <p className="text-xs text-gray-500">₹{prod.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        prod.stock === 0
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {prod.stock === 0 ? "Out of stock" : `${prod.stock} left`}
                    </span>
                    <Link
                      to={`/admin/products/edit/${prod._id}`}
                      className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-gray-900 hover:underline flex items-center gap-1"
          >
            Manage all orders <ArrowRight size={14} />
          </Link>
        </div>

        {(!stats.recentOrders || stats.recentOrders.length === 0) ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th scope="col" className="px-5 py-3">Order ID</th>
                  <th scope="col" className="px-5 py-3">Customer</th>
                  <th scope="col" className="px-5 py-3">Date</th>
                  <th scope="col" className="px-5 py-3">Total</th>
                  <th scope="col" className="px-5 py-3">Status</th>
                  <th scope="col" className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="transition-colors hover:bg-gray-50">
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-medium text-gray-900">
                      #{order._id.substring(order._id.length - 8)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                      {order.Address?.fullName || order.user?.username || "Customer"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-950">
                      ₹{order.totalPrice?.toLocaleString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : order.status === "Cancelled"
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : order.status === "Pending"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <Link
                        to="/admin/orders"
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminDashboard;
