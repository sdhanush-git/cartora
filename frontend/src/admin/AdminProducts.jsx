import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Plus, Search, Trash2, Edit, CheckCircle, XCircle, AlertCircle, X, Check } from "lucide-react";
import { useToast } from "../context/ToastContext";

export const AdminProducts = () => {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products?all=true");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Cartora | Admin Products";
    fetchProducts();
  }, []);

  const handleToggleActive = async (product) => {
    const newStatus = product.isActive === false ? true : false;
    try {
      await api.put(`/products/${product._id}`, { isActive: newStatus });
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, isActive: newStatus } : p))
      );
      toast.success(newStatus ? "Product reactivated." : "Product deactivated.");
    } catch (error) {
      toast.error("Unable to update product status.");
    }
  };

  const handleConfirmDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully.");
      setDeletingId(null);
    } catch (error) {
      toast.error("Unable to delete product.");
    }
  };

  const categories = [...new Set(products.map((p) => p.category))].filter(Boolean);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? p.isActive !== false
          : p.isActive === false;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Product Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View, filter, edit, restock, or deactivate products in your catalog.
          </p>
        </div>
        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-gray-950"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 outline-none transition focus:border-gray-950"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 outline-none transition focus:border-gray-950"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Table & Cards */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {loading ? (
          <div className="divide-y divide-gray-100 p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center justify-between py-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-200" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-32 rounded bg-gray-200" />
                    <div className="h-2.5 w-20 rounded bg-gray-100" />
                  </div>
                </div>
                <div className="h-4 w-16 rounded bg-gray-200" />
                <div className="h-4 w-12 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Product</th>
                  <th scope="col" className="px-5 py-3.5">Category</th>
                  <th scope="col" className="px-5 py-3.5">Price</th>
                  <th scope="col" className="px-5 py-3.5">Stock</th>
                  <th scope="col" className="px-5 py-3.5">Status</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredProducts.map((product) => {
                  const isDeactivated = product.isActive === false;
                  const isLowStock = product.stock > 0 && product.stock <= 5;
                  const isOutOfStock = product.stock === 0;

                  return (
                    <tr key={product._id} className="transition-colors hover:bg-gray-50">
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            className="h-10 w-10 rounded-xl border border-gray-200 object-cover bg-gray-50"
                            src={product.image}
                            alt={product.name}
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-400">ID: {product._id.substring(product._id.length - 6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-gray-600">
                        {product.category}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-950">
                        ₹{product.price}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            isOutOfStock
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : isLowStock
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {isOutOfStock ? "0 in stock" : `${product.stock} in stock`}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <button
                          onClick={() => handleToggleActive(product)}
                          title="Click to toggle active/inactive status"
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition ${
                            isDeactivated
                              ? "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                              : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                          }`}
                        >
                          {isDeactivated ? "Inactive" : "Active"}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        {deletingId === product._id ? (
                          <div className="inline-flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                            <span className="text-[11px] font-medium text-red-700 mr-1">Confirm?</span>
                            <button
                              onClick={() => handleConfirmDelete(product._id)}
                              className="rounded bg-red-600 p-1 text-white hover:bg-red-700 cursor-pointer"
                              title="Yes, delete"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="rounded bg-gray-200 p-1 text-gray-700 hover:bg-gray-300 cursor-pointer"
                              title="Cancel"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-3">
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="text-gray-500 hover:text-gray-900 transition"
                              title="Edit product"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => setDeletingId(product._id)}
                              className="text-gray-400 hover:text-red-600 transition cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
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
export default AdminProducts;
