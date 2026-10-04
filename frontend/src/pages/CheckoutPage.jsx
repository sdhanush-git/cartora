import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

import { useProduct } from "../context/ProductContext";
import { AddressForm } from "../components/AddressForm";
import { useToast } from "../context/ToastContext";
import api from "../api/axios";

export const CheckoutPage = () => {
  const { cartItems, clearCart } = useProduct();
  const navigate = useNavigate();
  const toast = useToast();

  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  React.useEffect(() => {
    document.title = "Cartora | Checkout";
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const delivery = subtotal >= 5000 ? 0 : 99;
  const totalPrice = subtotal + delivery;

  const handleAddressSubmit = (formData) => {
    setAddress(formData);
  };

  const handlePlaceOrder = async () => {
    if (!address || loading) return;

    try {
      setLoading(true);
      setErrorMsg("");

      const orderData = {
        Address: address,
      };

      await api.post("/orders", orderData);

      await clearCart();
      setSuccess(true);
      toast.success("Order placed successfully.");
      
      setTimeout(() => {
        navigate("/orders");
      }, 1500);

    } catch (error) {
      console.log("Error placing order:", error);
      const msg = error.response?.data?.message || "Unable to place order.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Your cart is empty
        </h2>
        <Link
          to="/products"
          className="mt-5 inline-block text-sm text-gray-600 underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            to="/cart"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            {!address ? (
              <>
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900">Delivery Address</h2>
                    <p className="text-sm text-gray-500">Where should we deliver your order?</p>
                  </div>
                </div>
                <AddressForm onSubmit={handleAddressSubmit} />
              </>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-medium text-gray-900">Delivery Address</h2>
                    <p className="text-sm text-gray-500">Your delivery details</p>
                  </div>
                  <button
                    onClick={() => setAddress(null)}
                    disabled={loading || success}
                    className="text-sm text-gray-500 underline hover:text-gray-900 disabled:opacity-50"
                  >
                    Edit
                  </button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">{address.fullName}</p>
                  <p>{address.phone}</p>
                  <p className="mt-2">{address.address}</p>
                  <p>{address.city}, {address.state} {address.pincode}</p>
                </div>

                {errorMsg && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                        {errorMsg}
                    </div>
                )}
                
                {success && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-100 text-green-700 rounded-lg text-sm">
                        Order placed successfully. Redirecting to your orders...
                    </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || success}
                  className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Placing order..." : success ? "Order placed successfully" : "Place Order"}
                </button>
              </>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="h-fit rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-5 font-medium text-gray-900">Order Summary</h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3 border-b border-gray-100 pb-4">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span>{delivery === 0 ? "Free" : `₹${delivery}`}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-base font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
