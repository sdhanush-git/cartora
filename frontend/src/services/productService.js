import api from "../api/axios";

// 1. Get all products
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// 2. Get one product by ID
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// 3. Create a product (Admin)
export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

// 4. Update a product (Admin)
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

// 5. Delete a product (Admin)
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
