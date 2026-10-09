import React, { useEffect, useState, useCallback } from "react";
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
  RefreshCw,
  AlertCircle,
  Plus,
  Activity,
  CheckCircle,
} from "lucide-react";

export const AdminDashboard = () => {
  // Stale-while-revalidate for instant loading
  const [stats, setStats] = useState(() => {
    try {
      const cached = sessionStorage.getItem("cartora_admin_stats");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!stats);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else if (!stats) {
      setLoading(true);
    }

    try {
      setError(null);
      const res = await api.get("/admin/stats");
      setStats(res.data);
      try {
        sessionStorage.setItem("cartora_admin_stats", JSON.stringify(res.data));
      } catch {
        // ignore cache write error
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Unable to load statistics.";
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [stats]);

  useEffect(() => {
    document.title = "Cartora | Admin Dashboard";
    fetchStats();
  }, [fetchStats]);

  // Loading skeleton state
  if (loading && !stats) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-48 rounded-lg bg-gray-200" />
            <div className="h-4 w-72 rounded bg-gray-100" />
          </div>
          <div className="h-9 w-24 rounded-lg bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gray-100" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-20 rounded bg-gray-200" />
                  <div className="h-6 w-24 rounded bg-gray-200" />
                  <div className="h-3 w-16 rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-64 rounded-2xl bg-white border border-gray-100 p-5" />
          <div className="h-64 rounded-2xl bg-white border border-gray-100 p-5 lg:col-span-2" />
        </div>
      </div>
    );
  }

  // Error state when no cache is available
  if (error && !stats) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle size={24} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Unable to Load Dashboard
          </h2>
          <p className="mt-1.5 text-sm text-gray-500 max-w-md mx-auto">
            {error}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => fetchStats(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
            <Link
              to="/admin/products"
              className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Manage Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`,
      sub: "Excluding cancelled orders",
      icon: IndianRupee,
      bg: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
    },
    {
      name: "Total Orders",
      value: (stats?.totalOrders || 0).toLocaleString(),
      sub: `${stats?.pendingOrders || 0} pending processing`,
      icon: ShoppingBag,
      bg: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
    {
      name: "Total Products",
      value: (stats?.totalProducts || 0).toLocaleString(),
      sub: `${stats?.activeProducts || 0} currently active`,
      icon: Package,
      bg: "bg-purple-50 text-purple-600",
      border: "border-purple-100",
    },
    {
      name: "Total Users",
      value: (stats?.totalUsers || 0).toLocaleString(),
      sub: "Registered customers",
      icon: Users,
      bg: "bg-amber-50 text-amber-600",
      border: "border-amber-100",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Background Error notification if cached data is shown */}
      {error && stats && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-600" />
            <span>Could not refresh live statistics. Showing cached data.</span>
          </div>
          <button
            onClick={() => fetchStats(true)}
            className="font-semibold underline hover:text-amber-950 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Dashboard Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Real-time store metrics, inventory alerts, and latest customer orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw
              size={14}
              className={`text-gray-500 ${refreshing ? "animate-spin text-gray-900" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <Link
            to="/admin/products/add"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-gray-800 transition-colors"
          >
            <Plus size={14} />
            Add Product
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-gray-300"
          >
            <div className="flex items-center">
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border ${stat.border} ${stat.bg} transition-transform group-hover:scale-105`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 truncate">
                  {stat.name}
                </p>
                <p className="mt-0.5 text-2xl font-bold tracking-tight text-gray-950 truncate">
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
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs lg:col-span-1">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-gray-500" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                Orders by Status
              </h2>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {stats?.totalOrders || 0} total
            </span>
          </div>

          <div className="mt-3.5 space-y-2">
            {[
              { status: "Pending", dot: "bg-amber-400" },
              { status: "Confirmed", dot: "bg-blue-400" },
              { status: "Processing", dot: "bg-indigo-400" },
              { status: "Shipped", dot: "bg-purple-400" },
              { status: "Delivered", dot: "bg-emerald-500" },
              { status: "Cancelled", dot: "bg-red-400" },
            ].map(({ status, dot }) => {
              const count = stats?.statusBreakdown?.[status] || 0;
              return (
                <div
                  key={status}
                  className="flex items-center justify-between rounded-xl bg-gray-50/80 px-3.5 py-2 text-xs transition-colors hover:bg-gray-100/70"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${dot}`} />
                    <span className="font-medium text-gray-700">{status}</span>
                  </div>
                  <span className="rounded-md bg-white px-2 py-0.5 text-xs font-bold text-gray-900 border border-gray-200">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                Low Stock Alert ({stats?.lowStockProducts || 0})
              </h2>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-medium text-gray-900 hover:underline flex items-center gap-1"
            >
              View all products <ArrowRight size={13} />
            </Link>
          </div>

          {!stats?.lowStockList || stats.lowStockList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-2">
                <CheckCircle size={20} />
              </div>
              <p className="text-xs font-medium text-gray-700">All inventory levels healthy</p>
              <p className="text-[11px] text-gray-400 mt-0.5">No products currently below 5 units in stock.</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {stats.lowStockList.map((prod) => (
                <div
                  key={prod._id}
                  className="flex items-center justify-between py-2.5 transition-colors hover:bg-gray-50/50 px-2 rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-10 w-10 rounded-lg object-cover bg-gray-50 border border-gray-200 flex-shrink-0"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/40x40?text=Item";
                      }}
                    />
                    <div className="min-w-0 truncate">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {prod.name}
                      </p>
                      <p className="text-[11px] text-gray-500">₹{prod.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        prod.stock === 0
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {prod.stock === 0 ? "Out of stock" : `${prod.stock} left`}
                    </span>
                    <Link
                      to={`/admin/products/edit/${prod._id}`}
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Recent Customer Orders</h2>
            <p className="text-xs text-gray-400 mt-0.5">Latest purchase requests made across the store</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-gray-900 hover:underline flex items-center gap-1"
          >
            Manage all orders <ArrowRight size={13} />
          </Link>
        </div>

        {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
          <div className="p-10 text-center">
            <ShoppingBag size={28} className="mx-auto text-gray-300 mb-2" />
            <p className="text-xs font-medium text-gray-700">No orders yet</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Customer orders will appear here once placed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
              <thead className="bg-gray-50/70 uppercase tracking-wider text-gray-500 font-semibold">
                <tr>
                  <th scope="col" className="px-5 py-3">Order ID</th>
                  <th scope="col" className="px-5 py-3">Customer</th>
                  <th scope="col" className="px-5 py-3">Date</th>
                  <th scope="col" className="px-5 py-3">Total Amount</th>
                  <th scope="col" className="px-5 py-3">Status</th>
                  <th scope="col" className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {stats.recentOrders.map((order) => {
                  const customerName =
                    order.Address?.fullName || order.user?.username || "Customer";
                  const customerEmail =
                    order.user?.email || order.Address?.phone || "";

                  return (
                    <tr key={order._id} className="transition-colors hover:bg-gray-50/60">
                      <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs font-semibold text-gray-900">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-700">
                            {customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{customerName}</p>
                            {customerEmail && (
                              <p className="text-[11px] text-gray-400">{customerEmail}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 font-bold text-gray-950">
                        ₹{(order.totalPrice || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : order.status === "Cancelled"
                                ? "bg-red-50 text-red-600 border-red-200"
                                : order.status === "Pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right">
                        <Link
                          to="/admin/orders"
                          className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
