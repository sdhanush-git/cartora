import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, ChevronRight } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/orders/myorders`);
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Unable to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getOrders();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/products"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>

          <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            View your recent orders and their status.
          </p>
        </div>

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-xl border border-gray-200 bg-white p-5 animate-pulse space-y-4"
              >
                <div className="flex justify-between border-b border-gray-100 pb-4">
                  <div className="space-y-2">
                    <div className="h-3 w-16 rounded bg-gray-200" />
                    <div className="h-4 w-28 rounded bg-gray-200" />
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-20 rounded-full bg-gray-200" />
                    <div className="h-6 w-16 rounded bg-gray-200" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-gray-200" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 w-40 rounded bg-gray-200" />
                      <div className="h-2.5 w-20 rounded bg-gray-100" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
            {error}
          </div>
        ) : orders.length === 0 ? (
          /* Empty Orders */
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Package size={22} className="text-gray-500" />
            </div>

            <h2 className="text-lg font-medium text-gray-900">You have no orders yet.</h2>
            <p className="mt-1 text-sm text-gray-500">
              Your placed orders will appear here.
            </p>

            <Link
              to="/products"
              className="mt-5 inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-sm"
              >
                {/* Order Header */}
                <div className="flex flex-col justify-between gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="mt-0.5 text-sm font-medium text-gray-900">
                      #{order._id.slice(-8)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-700"
                          : order.status === "Cancelled"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>

                    <p className="text-sm font-semibold text-gray-900">
                      ₹{order.totalPrice.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-4 space-y-3">
                  {order.orderItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                            <Package size={16} />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 text-sm text-gray-700">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer with Date & View Details Link */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-400">
                    Ordered on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-900 hover:text-gray-600 transition"
                  >
                    View Details
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
