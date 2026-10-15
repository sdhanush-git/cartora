import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductById } from "../services/productService";

// Fetch all products
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
};

// Fetch a single product by ID
export const useProductById = (id) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
};
