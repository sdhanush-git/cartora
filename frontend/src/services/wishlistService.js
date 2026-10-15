import api from "../api/axios";

// Fetch wishlist
export const getWishlist = async () => {
  const response = await api.get("/wishlist");
  return response.data;
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  const response = await api.post("/wishlist", {
    productId,
  });

  return response.data;
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};

// Move wishlist product to cart
export const moveWishlistItemToCart = async (productId) => {
  const response = await api.post(`/wishlist/${productId}/move-to-cart`);

  return response.data;
};
