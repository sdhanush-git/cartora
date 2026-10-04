import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { useProduct } from "./ProductContext";

const WishlistContext = createContext();

export const WishlistContextProvider = ({ children }) => {
  const { user } = useAuth();
  const toast = useToast();
  const { addToCart } = useProduct();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      return;
    }
    try {
      setWishlistLoading(true);
      const res = await api.get("/wishlist");
      setWishlistItems(res.data.products || []);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    } finally {
      setWishlistLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    if (!user) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }
    try {
      const res = await api.post("/wishlist", { productId });
      setWishlistItems(res.data.products || []);
      toast.success("Added to wishlist.");
    } catch (error) {
      const msg = error.response?.data?.message || "Unable to update your wishlist.";
      toast.error(msg);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      const res = await api.delete(`/wishlist/${productId}`);
      setWishlistItems(res.data.products || []);
      toast.success("Removed from wishlist.");
    } catch (error) {
      const msg = error.response?.data?.message || "Unable to update your wishlist.";
      toast.error(msg);
    }
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      toast.error("Please log in to use your wishlist.");
      return;
    }
    const exists = wishlistItems.some((item) => item._id === product._id);
    if (exists) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  const moveToCart = async (product) => {
    if (!user) {
      toast.error("Please log in.");
      return;
    }
    try {
      const res = await api.post(`/wishlist/${product._id}/move-to-cart`);
      setWishlistItems(res.data.wishlist || []);
      // Refresh or add into cart
      await addToCart(product, 1);
      toast.success("Moved to cart.");
    } catch (error) {
      const msg = error.response?.data?.message || "Unable to move item to cart.";
      toast.error(msg);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const value = {
    wishlistItems,
    wishlistLoading,
    wishlistCount: wishlistItems.length,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    moveToCart,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};
