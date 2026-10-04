import React, { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { Filter, X, SlidersHorizontal } from "lucide-react";
import api from "../api/axios";
import Card from "../components/Card";

export const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const { categoryParam } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const q = searchParams.get("q") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const inStock = searchParams.get("inStock") || "";
  const sort = searchParams.get("sort") || "newest";
  const category = categoryParam || searchParams.get("category") || "";

  const activeFilterCount =
    (category ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (inStock ? 1 : 0);

  useEffect(() => {
    if (q) {
      document.title = `Cartora | Search: "${q}"`;
    } else if (category) {
      document.title = `Cartora | ${category}`;
    } else {
      document.title = "Cartora | Products";
    }
  }, [q, category]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/products/categories/list");
        setCategories(res.data);
      } catch (e) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/products?`;
        if (q) url += `q=${encodeURIComponent(q)}&`;
        if (category) url += `category=${encodeURIComponent(category)}&`;
        if (minPrice) url += `minPrice=${minPrice}&`;
        if (maxPrice) url += `maxPrice=${maxPrice}&`;
        if (inStock) url += `inStock=${inStock}&`;
        if (sort) url += `sort=${sort}&`;

        const res = await api.get(url);
        setProducts(res.data);
      } catch (err) {
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [q, category, minPrice, maxPrice, inStock, sort]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    if (key === "category" && categoryParam) {
      navigate(`/search?${newParams.toString()}`);
      return;
    }

    navigate(`?${newParams.toString()}`);
  };

  const clearFilters = () => {
    navigate("/products");
    setMobileFiltersOpen(false);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Categories
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer hover:text-gray-950">
            <input
              type="radio"
              name="category"
              checked={!category}
              onChange={() => handleFilterChange("category", "")}
              className="accent-gray-950"
            />
            All Categories
          </label>
          {categories.map((c) => (
            <label
              key={c}
              className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer hover:text-gray-950"
            >
              <input
                type="radio"
                name="category"
                checked={category.toLowerCase() === c.toLowerCase()}
                onChange={() => handleFilterChange("category", c)}
                className="accent-gray-950"
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Price Range (₹)
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-gray-950"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-gray-950"
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Availability
        </h3>
        <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer hover:text-gray-950">
          <input
            type="checkbox"
            checked={inStock === "true"}
            onChange={(e) =>
              handleFilterChange("inStock", e.target.checked ? "true" : "")
            }
            className="h-4 w-4 rounded accent-gray-950"
          />
          In Stock Only
        </label>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 cursor-pointer"
        >
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <main className="mx-auto max-w-7xl min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      {/* Mobile Filter Drawer Overlay */}
      {mobileFiltersOpen && (
        <div
          onClick={() => setMobileFiltersOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-80 flex-col bg-white p-6 shadow-2xl transition-transform duration-300 md:hidden ${
          mobileFiltersOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-gray-900" />
            <h2 className="text-base font-bold text-gray-900">Filters</h2>
          </div>
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <FilterContent />
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="w-full rounded-xl bg-gray-950 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Show {products.length} Products
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden w-64 flex-shrink-0 md:block">
          <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-950">
                Filters
              </h2>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-800">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1 min-w-0">
          {/* Header row: title, mobile filter button, sort dropdown */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                {q
                  ? `Search: "${q}"`
                  : categoryParam
                    ? categoryParam
                    : "All Products"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {loading
                  ? "Loading products..."
                  : `${products.length} ${products.length === 1 ? "product" : "products"} available`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 md:hidden cursor-pointer"
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-950 text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Selector */}
              <select
                value={sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-800 outline-none transition focus:border-gray-950 shadow-xs cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Product Items */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 space-y-4 animate-pulse"
                >
                  <div className="h-56 w-full rounded-xl bg-gray-100" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-full rounded bg-gray-100" />
                    <div className="h-3 w-4/5 rounded bg-gray-100" />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="h-5 w-16 rounded bg-gray-200" />
                    <div className="h-9 w-24 rounded-xl bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 px-4 text-center">
              <h3 className="text-lg font-bold text-gray-900">
                {q
                  ? "No products found for your search."
                  : category
                    ? "No products in this category."
                    : "No products found."}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search query, price range, or category filter.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-gray-950 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
