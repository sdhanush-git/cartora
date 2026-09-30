import React from "react";
import { Minus, Plus, Trash2, ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

export const CartPage = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    totalItems,
  } = useProduct();

  const navigate = useNavigate();
  // Subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Delivery
  const delivery = subtotal >= 5000 ? 0 : 99;

  // Final total
  const total = subtotal + delivery;

  const handeleCkeckout = () => {
    navigate("/checkout");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/products"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-950"
          >
            <ArrowLeft size={16} />
            Continue shopping
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
            Your Cart
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {totalItems} {totalItems === 1 ? "item" : "items"} ready for
            checkout
          </p>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              🛒
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Looks like you haven't added anything yet.
            </p>

            <Link
              to="/products"
              className="mt-5 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Cart Items */}
            <section className="space-y-3">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Items
                </h2>

                <span className="text-sm text-gray-400">
                  {totalItems} total
                </span>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="group flex gap-4 rounded-2xl border border-gray-200 bg-white p-3 sm:p-4"
                >
                  {/* Product Image */}
                  <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            ₹{item.price.toLocaleString("en-IN")}
                          </p>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => removeItem(item._id)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-gray-200">
                        {/* Decrease */}
                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          disabled={item.quantity <= 1}
                          className="flex h-8 w-8 items-center justify-center text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Minus size={14} />
                        </button>

                        {/* Quantity */}
                        <span className="flex h-8 min-w-8 items-center justify-center border-x border-gray-200 px-2 text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>

                        {/* Increase */}
                        <button
                          onClick={() => increaseQuantity(item._id)}
                          disabled={item.quantity >= item.stock}
                          className="flex h-8 w-8 items-center justify-center text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Order Summary */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-950">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">
                  {/* Items */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Items ({totalItems})</span>

                    <span className="font-medium text-gray-900">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Delivery */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery</span>

                    <span className="font-medium text-gray-900">
                      {delivery === 0 ? "Free" : `₹${delivery}`}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total</p>

                        <p className="mt-0.5 text-xs text-gray-400">
                          Inclusive of all applicable charges
                        </p>
                      </div>

                      <p className="text-2xl font-semibold tracking-tight text-gray-950">
                        ₹{total.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Place Order */}
                <button
                  onClick={handeleCkeckout}
                  className="mt-6 w-full rounded-xl bg-gray-950 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99]"
                >
                  Place Order
                </button>

                {/* Security */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck size={14} />
                  Secure checkout
                </div>
              </div>

              {/* Free Delivery */}
              {subtotal < 5000 && (
                <div className="mt-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-xs text-gray-500">
                  Add ₹{(5000 - subtotal).toLocaleString("en-IN")} more for{" "}
                  <span className="font-medium text-gray-800">
                    free delivery
                  </span>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};
