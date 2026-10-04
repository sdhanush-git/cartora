import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Calendar, Clock, CheckCircle } from "lucide-react";
import api from "../api/axios";

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Access denied. You cannot view this order.");
        } else if (err.response?.status === 404) {
          setError("Order not found.");
        } else {
          setError("Unable to load data.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="h-6 w-32 rounded bg-gray-200 animate-pulse" />
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4 animate-pulse">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-5 w-40 rounded bg-gray-200" />
                <div className="h-3 w-28 rounded bg-gray-100" />
              </div>
              <div className="h-6 w-20 rounded-full bg-gray-200" />
            </div>
            <div className="h-24 w-full rounded-lg bg-gray-100" />
            <div className="h-20 w-full rounded-lg bg-gray-100" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Package size={24} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{error || "Unable to load data."}</h2>
          <p className="mt-2 text-sm text-gray-500">
            Please check the order link or return to your orders list.
          </p>
          <Link
            to="/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const statusStyles = {
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Confirmed: "bg-purple-50 text-purple-700 border-purple-200",
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        {/* Order Header Summary */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight text-gray-900">
                  Order #{order._id.substring(order._id.length - 8)}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                    statusStyles[order.status] || "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {order.status}
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar size={13} />
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-400">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{order.totalPrice.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-5 md:grid-cols-2">
            {/* Delivery Address */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <MapPin size={16} className="text-gray-400" />
                Shipping Address
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                <p className="font-semibold text-gray-900">{order.Address?.fullName}</p>
                <p className="mt-1 text-xs text-gray-500">Phone: {order.Address?.phone}</p>
                <p className="mt-2">{order.Address?.address}</p>
                <p>
                  {order.Address?.city}, {order.Address?.state} - {order.Address?.pincode}
                </p>
              </div>
            </div>

            {/* Payment & Order Summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Clock size={16} className="text-gray-400" />
                Order Summary
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Items Count</span>
                  <span className="font-medium text-gray-900">
                    {order.orderItems.reduce((acc, item) => acc + item.quantity, 0)} items
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-medium text-gray-900">Cash on Delivery</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
                  <span>Total Paid/Payable</span>
                  <span>₹{order.totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900">
            Ordered Items ({order.orderItems.length})
          </h2>

          <div className="divide-y divide-gray-100">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-4 gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                      <Package size={22} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailsPage;
