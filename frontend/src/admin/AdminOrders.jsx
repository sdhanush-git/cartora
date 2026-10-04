import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Search, Eye, X, Package } from "lucide-react";
import { useToast } from "../context/ToastContext";

export const AdminOrders = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/orders?q=${encodeURIComponent(searchTerm)}&status=${statusFilter}`);
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status: newStatus });
      toast.success("Order status updated.");
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update order.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">Manage and track customer orders.</p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-gray-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-gray-900"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="divide-y divide-gray-100 p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center justify-between py-3 animate-pulse">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-24 rounded bg-gray-200" />
                  <div className="h-2.5 w-32 rounded bg-gray-100" />
                </div>
                <div className="h-3.5 w-28 rounded bg-gray-100" />
                <div className="h-4 w-16 rounded bg-gray-200" />
                <div className="h-5 w-20 rounded-full bg-gray-200" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Order ID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Items</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Total</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order) => (
                  <tr key={order._id} className="transition hover:bg-gray-50">
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
                      #{order._id.substring(order._id.length - 8)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.Address?.fullName || "N/A"}</div>
                      <div className="text-xs text-gray-500">{order.Address?.city}, {order.Address?.state}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="max-w-[200px] space-y-1">
                        {order.orderItems.map((item, i) => (
                           <div key={i} className="truncate text-xs text-gray-600">
                             {item.quantity}x {item.name}
                           </div>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
                      ₹{order.totalPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`rounded-lg border px-2 py-1 text-xs font-medium outline-none transition ${
                          order.status === 'Delivered' ? 'border-green-200 bg-green-50 text-green-700 focus:border-green-500' :
                          order.status === 'Cancelled' ? 'border-red-200 bg-red-50 text-red-700 focus:border-red-500' :
                          'border-yellow-200 bg-yellow-50 text-yellow-700 focus:border-yellow-500'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{selectedOrder._id}
                </h3>
                <p className="text-xs text-gray-500">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Status and Total */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-lg font-bold text-gray-900">
                    ₹{selectedOrder.totalPrice.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Delivery Address</h4>
                <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">{selectedOrder.Address?.fullName}</p>
                  <p>Phone: {selectedOrder.Address?.phone}</p>
                  <p>{selectedOrder.Address?.address}</p>
                  <p>{selectedOrder.Address?.city}, {selectedOrder.Address?.state} - {selectedOrder.Address?.pincode}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Order Items</h4>
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₹{(item.quantity * item.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
