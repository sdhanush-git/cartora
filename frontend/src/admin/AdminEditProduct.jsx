import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft } from "lucide-react";
import { useToast } from "../context/ToastContext";

export const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    isActive: true,
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setFormData({
          name: res.data.name || "",
          description: res.data.description || "",
          price: res.data.price || "",
          category: res.data.category || "",
          stock: res.data.stock || "",
          image: res.data.image || "",
          isActive: res.data.isActive !== false,
        });
      } catch (error) {
        toast.error("Unable to load product data.");
        navigate("/admin/products");
      } finally {
        setInitLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await api.get("/products/categories/list");
        setCategories(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProduct();
    fetchCategories();
  }, [id, navigate, toast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.price) <= 0) return toast.error("Price must be greater than 0.");
    if (Number(formData.stock) < 0) return toast.error("Stock cannot be negative.");

    try {
      setLoading(true);
      await api.put(`/products/${id}`, formData);
      toast.success("Product updated.");
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save product.");
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-6 w-36 rounded bg-gray-200 animate-pulse" />
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4 animate-pulse">
          <div className="h-10 w-full rounded-lg bg-gray-100" />
          <div className="h-24 w-full rounded-lg bg-gray-100" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 rounded-lg bg-gray-100" />
            <div className="h-10 rounded-lg bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Product</h1>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Product Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900" />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Description *</label>
              <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Price (₹) *</label>
              <input type="number" name="price" required min="1" value={formData.price} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Stock Quantity *</label>
              <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category *</label>
              <input type="text" list="categories-list-edit" name="category" required value={formData.category} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900" />
              <datalist id="categories-list-edit">
                {categories.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Image URL *</label>
              <input type="url" name="image" required value={formData.image} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900" />
            </div>

            <div className="sm:col-span-2 pt-2">
              <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded accent-gray-950"
                />
                Active (Visible to customers on storefront)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <Link to="/admin/products" className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100">Cancel</Link>
            <button type="submit" disabled={loading} className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-60">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
