import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export const OrdersPage = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      const response = await api.get(`/orders/myorders/${user._id}`);

      setOrders(response.data);
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading your orders...</p>
      </div>
    );
  }

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

        {/* Empty Orders */}
        {orders.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Package size={22} className="text-gray-500" />
            </div>

            <h2 className="text-lg font-medium text-gray-900">No orders yet</h2>

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
          /* Orders */
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-xl border border-gray-200 bg-white p-5"
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
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {order.status}
                    </span>

                    <p className="text-sm font-semibold text-gray-900">
                      ₹{order.totalPrice}
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-4 space-y-3">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <Package size={16} className="text-gray-500" />
                        </div>

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
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Date */}
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-400">
                    Ordered on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
