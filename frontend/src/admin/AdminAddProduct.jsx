import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft } from "lucide-react";
import { useToast } from "../context/ToastContext";

export const AdminAddProduct = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });
  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    api.get("/products/categories/list").then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.price) <= 0) return toast.error("Price must be greater than 0.");
    if (Number(formData.stock) < 0) return toast.error("Stock cannot be negative.");

    try {
      setLoading(true);
      await api.post("/products", formData);
      toast.success("Product added.");
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add New Product</h1>
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
              <input type="text" list="categories-list" name="category" required value={formData.category} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900" />
              <datalist id="categories-list">
                {categories.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Image URL *</label>
              <input type="url" name="image" required value={formData.image} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900" />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <Link to="/admin/products" className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100">Cancel</Link>
            <button type="submit" disabled={loading} className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-60">
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
