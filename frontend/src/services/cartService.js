import api from "../api/axios";

// Fetch the logged-in user's cart
export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

// Add a product to the cart
export const addToCart = async ({ productId, quantity = 1 }) => {
  const response = await api.post("/cart", {
    productId,
    quantity,
  });

  return response.data;
};

// Update cart item quantity
export const updateCartQuantity = async ({ productId, quantity }) => {
  const response = await api.put(`/cart/${productId}`, {
    quantity,
  });

  return response.data;
};

// Remove a cart item
export const removeFromCart = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
};

// Clear the cart
export const clearCart = async () => {
  const response = await api.delete("/cart");
  return response.data;
};
