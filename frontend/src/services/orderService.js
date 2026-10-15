import api from "../api/axios";

// Fetch the logged-in user's orders
export const getMyOrders = async (userId) => {
  const response = await api.get(`/order/myorders/${userId}`);
  return response.data;
};

// Fetch one order
export const getOrderById = async (orderId) => {
  const response = await api.get(`/order/myorder/${orderId}`);
  return response.data;
};

// Create an order
export const createOrder = async (orderData) => {
  const response = await api.post("/order", orderData);
  return response.data;
};
