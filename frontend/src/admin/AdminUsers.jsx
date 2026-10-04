import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Search, ShoppingBag, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "../context/ToastContext";

export const AdminUsers = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // User Orders Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/admin/users?q=${encodeURIComponent(searchTerm)}&role=${roleFilter}&page=${page}&limit=10`
      );
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages || 1);
      setTotalUsers(res.data.totalUsers || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, page]);

  const [roleModalUser, setRoleModalUser] = useState(null);

  const initiateRoleChange = (id, newRole, currentRole, username) => {
    if (currentRole === newRole) return;
    if (newRole === "user" && currentRole === "admin") {
      setRoleModalUser({ id, newRole, currentRole, username });
    } else {
      executeRoleChange(id, newRole);
    }
  };

  const executeRoleChange = async (id, newRole) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role: newRole });
      toast.success("User role updated successfully.");
      setRoleModalUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update role.");
    }
  };

  const handleViewUserOrders = async (user) => {
    setSelectedUser(user);
    try {
      setLoadingOrders(true);
      const res = await api.get(`/admin/users/${user._id}/orders`);
      setUserOrders(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to fetch user orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage customers and admin accounts ({totalUsers} total users).
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-gray-900"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-gray-900"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="divide-y divide-gray-100 p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center justify-between py-3 animate-pulse">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 rounded bg-gray-200" />
                  <div className="h-2.5 w-48 rounded bg-gray-100" />
                </div>
                <div className="h-3.5 w-20 rounded bg-gray-100" />
                <div className="h-3.5 w-16 rounded bg-gray-100" />
                <div className="h-6 w-20 rounded-lg bg-gray-200" />
                <div className="h-7 w-24 rounded-lg bg-gray-200" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">User</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Joined</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Orders</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Role</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user._id} className="transition hover:bg-gray-50">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{user.orderCount}</span> orders
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          initiateRoleChange(user._id, e.target.value, user.role, user.username)
                        }
                        className={`rounded-lg border px-2 py-1 text-xs font-medium outline-none transition ${
                          user.role === "admin"
                            ? "border-purple-200 bg-purple-50 text-purple-700 focus:border-purple-500"
                            : "border-gray-200 bg-gray-50 text-gray-700 focus:border-gray-500"
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <button
                        onClick={() => handleViewUserOrders(user)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                      >
                        <ShoppingBag className="h-3.5 w-3.5 text-gray-500" />
                        View Orders
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-5 py-3">
            <p className="text-xs text-gray-500">
              Page <span className="font-medium text-gray-900">{page}</span> of{" "}
              <span className="font-medium text-gray-900">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Orders Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedUser.username}'s Orders
                </h3>
                <p className="text-xs text-gray-500">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              {loadingOrders ? (
                <div className="py-8 text-center text-sm text-gray-500">Loading user orders...</div>
              ) : userOrders.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  This user has not placed any orders yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order._id} className="rounded-xl border border-gray-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            #{order._id.substring(order._id.length - 8)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            order.status === "Delivered" ? "bg-green-100 text-green-800" :
                            order.status === "Cancelled" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            ₹{order.totalPrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-2 text-xs text-gray-600 space-y-1">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Confirmation Modal */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-gray-900">Confirm Role Change</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to change{" "}
              <strong className="text-gray-900">{roleModalUser.username}</strong> from{" "}
              <strong>{roleModalUser.currentRole}</strong> to{" "}
              <strong>{roleModalUser.newRole}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setRoleModalUser(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => executeRoleChange(roleModalUser.id, roleModalUser.newRole)}
                className="rounded-xl bg-gray-950 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
