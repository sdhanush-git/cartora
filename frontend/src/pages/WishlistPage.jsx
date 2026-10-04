import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export const WishlistPage = () => {
  const { user } = useAuth();
  const {
    wishlistItems,
    wishlistLoading,
    removeFromWishlist,
    moveToCart,
    fetchWishlist,
  } = useWishlist();

  useEffect(() => {
    document.title = "Cartora | Wishlist";
    if (user) {
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
          <Heart size={28} />
        </div>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-gray-950">
          Please log in
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Log in to your account to view and manage your saved items.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Log In
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  if (wishlistLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-36 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-48 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 w-full animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
          <Heart size={28} />
        </div>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-gray-950">
          Your wishlist is empty.
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Explore our collection and save the items you love for later.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Explore Products
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            My Wishlist
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistItems.map((product) => {
          if (!product) return null;
          const isOutOfStock = product.stock === 0;
          const isLowStock = product.stock > 0 && product.stock <= 5;

          return (
            <div
              key={product._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs transition duration-300 hover:shadow-md"
            >
              {/* Product Image */}
              <Link
                to={`/products/${product._id}`}
                className="relative block h-56 overflow-hidden bg-gray-50"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Stock Badge */}
                <div className="absolute left-3 top-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm ${
                      isOutOfStock
                        ? "bg-red-50/95 text-red-600 border border-red-200"
                        : isLowStock
                          ? "bg-amber-50/95 text-amber-700 border border-amber-200"
                          : "bg-emerald-50/95 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {isOutOfStock ? "Out of stock" : `${product.stock} in stock`}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(product._id);
                  }}
                  title="Remove from wishlist"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-500 backdrop-blur-sm transition hover:text-red-600 cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </Link>

              {/* Product Info */}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex-1">
                  {product.category && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      {product.category}
                    </span>
                  )}
                  <Link
                    to={`/products/${product._id}`}
                    className="mt-0.5 line-clamp-1 block text-base font-semibold text-gray-900 hover:text-gray-700"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-base font-bold text-gray-950">
                    ₹{product.price}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    disabled={isOutOfStock}
                    onClick={() => moveToCart(product)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-medium transition cursor-pointer ${
                      isOutOfStock
                        ? "cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200"
                        : "bg-gray-950 text-white hover:bg-gray-800"
                    }`}
                  >
                    <ShoppingCart size={14} />
                    {isOutOfStock ? "Out of Stock" : "Move to Cart"}
                  </button>

                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition hover:border-red-200 hover:text-red-600 cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default WishlistPage;
