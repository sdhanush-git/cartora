import { useProduct } from "../context/ProductContext";

const Card = ({ product }) => {
  const { addToCart } = useProduct();

  const handleOrder = (product) => {
    addToCart(product);
  };

  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Stock Badge */}
        <div className="absolute right-4 top-4">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm ${
              isOutOfStock
                ? "bg-red-50 text-red-600"
                : isLowStock
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {isOutOfStock ? "Out of stock" : `${product.stock} in stock`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-semibold tracking-tight text-gray-900">
            {product.name}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
            {product.description}
          </p>
        </div>

        {/* Price + Button */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="mt-0.5 text-xl font-semibold text-gray-900">
              ₹{product.price}
            </p>
          </div>

          <button
            disabled={isOutOfStock}
            onClick={() => handleOrder(product)}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              isOutOfStock
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] cursor-pointer"
            }`}
          >
            {isOutOfStock ? "Unavailable" : "Order Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
