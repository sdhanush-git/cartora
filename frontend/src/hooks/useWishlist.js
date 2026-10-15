import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import {
  getWishlist,
  addToWishlist as addToWishlistRequest,
  removeFromWishlist as removeFromWishlistRequest,
  moveWishlistItemToCart,
} from "../services/wishlistService";

export const useWishlist = () => {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const userId = user?._id ?? user?.id;

  const wishlistQuery = useQuery({
    queryKey: ["wishlist", userId],
    queryFn: getWishlist,
    enabled: Boolean(user),
  });

  const wishlistItems = wishlistQuery.data?.products || [];

  const refreshWishlist = () =>
    queryClient.invalidateQueries({
      queryKey: ["wishlist", userId],
    });

  const addMutation = useMutation({
    mutationFn: addToWishlistRequest,
    onSuccess: () => {
      refreshWishlist();
      toast.success("Added to wishlist.");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Unable to update wishlist.",
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWishlistRequest,
    onSuccess: () => {
      refreshWishlist();
      toast.success("Removed from wishlist.");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Unable to update wishlist.",
      );
    },
  });

  const moveMutation = useMutation({
    mutationFn: moveWishlistItemToCart,
    onSuccess: () => {
      refreshWishlist();

      queryClient.invalidateQueries({
        queryKey: ["cart", userId],
      });

      toast.success("Moved to cart.");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Unable to move item to cart.",
      );
    },
  });

  const requireLogin = () => {
    if (user) return true;

    toast.error("Please log in to use your wishlist.");
    return false;
  };

  const addToWishlist = (productId) => {
    if (!requireLogin()) return;

    return addMutation.mutateAsync(productId);
  };

  const removeFromWishlist = (productId) => {
    if (!requireLogin()) return;

    return removeMutation.mutateAsync(productId);
  };

  const toggleWishlist = (product) => {
    if (!requireLogin()) return;

    const exists = wishlistItems.some((item) => item._id === product._id);

    return exists
      ? removeMutation.mutateAsync(product._id)
      : addMutation.mutateAsync(product._id);
  };

  const moveToCart = (product) => {
    if (!requireLogin()) return;

    // Assumes this endpoint moves the item into the cart
    // on the backend and updates the wishlist.
    return moveMutation.mutateAsync(product._id);
  };

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item._id === productId);

  return {
    wishlistItems,
    wishlistCount: wishlistItems.length,

    isLoading: wishlistQuery.isPending,
    isError: wishlistQuery.isError,
    error: wishlistQuery.error,

    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    moveToCart,
    isInWishlist,

    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isMovingToCart: moveMutation.isPending,
  };
};
