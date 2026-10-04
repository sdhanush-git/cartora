import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";
import api from "../api/axios";

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Cartora | Categories";
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products/categories/list?details=true");
        setCategories(res.data);
      } catch (err) {
        setError("Unable to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <main className="mx-auto max-w-7xl min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Browse by Category
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Explore curated collections designed to elevate your living spaces.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-64 w-full animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
          {error}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <Layers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-base font-semibold text-gray-900">
            No categories found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Check back soon as we update our product catalog.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/category/${encodeURIComponent(cat.name)}`}
              className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 p-6 text-white shadow-xs transition duration-300 hover:shadow-lg"
            >
              {/* Background Image */}
              {cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-75"
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-white group-hover:text-gray-100 sm:text-2xl">
                      {cat.name}
                    </h2>
                    <p className="mt-1 text-xs text-gray-300">
                      {cat.count} {cat.count === 1 ? "product" : "products"}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-gray-950">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default CategoriesPage;
