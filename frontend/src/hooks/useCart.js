import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import {
  getCart,
  addToCart as addToCartRequest,
  updateCartQuantity,
  removeFromCart,
  clearCart as clearCartRequest,
} from "../services/cartService";

export const useCart = () => {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const userId = user?._id ?? user?.id;

  const cartQuery = useQuery({
    queryKey: ["cart", userId],
    queryFn: getCart,
    enabled: Boolean(user),
  });

  const refreshCart = () =>
    queryClient.invalidateQueries({
      queryKey: ["cart", userId],
    });

  const addMutation = useMutation({
    mutationFn: addToCartRequest,
    onSuccess: () => {
      refreshCart();
      toast.success("Added to cart.");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to add to cart.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCartQuantity,
    onSuccess: () => {
      refreshCart();
      toast.success("Cart updated.");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to update cart.");
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      refreshCart();
      toast.success("Removed from cart.");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to remove item.");
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearCartRequest,
    onSuccess: () => {
      refreshCart();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to clear cart.");
    },
  });

  const cartItems = (cartQuery.data?.items || []).map((item) => ({
    ...item.product,
    quantity: item.quantity,
  }));

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return {
    cartItems,
    totalItems,

    isLoading: cartQuery.isPending,
    isError: cartQuery.isError,
    error: cartQuery.error,

    addToCart: (product, quantity = 1) => {
      if (!user) {
        toast.error("Please log in.");
        return;
      }

      return addMutation.mutateAsync({
        productId: product._id,
        quantity,
      });
    },

    updateQuantity: (productId, quantity) =>
      updateMutation.mutateAsync({ productId, quantity }),

    removeItem: (productId) => removeMutation.mutateAsync(productId),

    clearCart: () => {
      if (user) return clearMutation.mutateAsync();
    },

    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
  };
};
