import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useProduct } from "../context/ProductContext";
import { useWishlist } from "../context/WishlistContext";

const Card = ({ product }) => {
  const { addToCart } = useProduct();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleOrder = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;
  const inWishlist = isInWishlist(product._id);

  return (
    <div className="group relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Image Container */}
      <Link to={`/products/${product._id}`} className="relative block h-64 overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200 ${
            inWishlist
              ? "border-rose-200 bg-white text-rose-500 shadow-sm"
              : "border-gray-200/80 bg-white/90 text-gray-500 hover:text-gray-900 hover:scale-105"
          }`}
        >
          <Heart size={16} className={inWishlist ? "fill-rose-500" : ""} />
        </button>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex-1">
          {product.category && (
            <span className="mb-1 block text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
              {product.category}
            </span>
          )}
          <Link
            to={`/products/${product._id}`}
            className="block text-base font-semibold tracking-tight text-gray-900 hover:text-gray-700"
          >
            {product.name}
          </Link>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {product.description}
          </p>
        </div>

        {/* Price + Button */}
        <div className="mt-4 flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Price</p>
            <p className="mt-0.5 text-lg font-bold text-gray-950">
              ₹{product.price}
            </p>
          </div>

          <button
            disabled={isOutOfStock}
            onClick={(e) => handleOrder(e, product)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isOutOfStock
                ? "cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200"
                : "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] cursor-pointer"
            }`}
          >
            {isOutOfStock ? "Out of stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
