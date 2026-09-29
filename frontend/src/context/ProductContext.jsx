import { useContext, createContext, useState, useEffect } from "react";
import api from "../api/axios";

const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const products = await api.get("/products");

    setProducts(products.data);
  };

  const [cartItems, setCartItems] = useState(() => {
    try {
      const existingItems = localStorage.getItem("cartItems");

      return existingItems ? JSON.parse(existingItems) : [];
    } catch (error) {
      console.log("Erro while fetching cart items from localstorage");

      return [];
    }
  });

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      let updatedItems;

      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        updatedItems = prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        updatedItems = [...prevItems, { ...product, quantity }];
      }

      localStorage.setItem("cartItems", JSON.stringify(updatedItems));

      return updatedItems;
    });
  };

  const value = { products, getProducts, addToCart };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProduct = () => {
  return useContext(ProductContext);
};
