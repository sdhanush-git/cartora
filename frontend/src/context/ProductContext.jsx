import { useContext, createContext, useState, useEffect } from "react";
import api from "../api/axios";

const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // =========================
  // GET PRODUCTS
  // =========================
  const getProducts = async () => {
    try {
      const products = await api.get("/products");
      setProducts(products.data);
    } catch (error) {
      console.log("Error while fetching products", error);
    }
  };

  // =========================
  // CART ITEMS
  // =========================
  const [cartItems, setCartItems] = useState(() => {
    try {
      const existingItems = localStorage.getItem("cartItems");

      return existingItems ? JSON.parse(existingItems) : [];
    } catch (error) {
      console.log("Error while fetching cart items from localStorage");
      return [];
    }
  });

  // =========================
  // SAVE CART TO LOCAL STORAGE
  // =========================
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        );
      }

      return [
        ...prevItems,
        {
          ...product,
          quantity,
        },
      ];
    });
  };

  // =========================
  // INCREASE QUANTITY
  // =========================
  const increaseQuantity = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item._id === id && item.quantity < item.stock
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  // =========================
  // DECREASE QUANTITY
  // =========================
  const decreaseQuantity = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item._id === id && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item,
      ),
    );
  };

  // =========================
  // DELETE FROM CART
  // =========================
  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item._id !== id));
  };

  // =========================
  // TOTAL ITEMS
  // =========================
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // =========================
  // CONTEXT VALUE
  // =========================
  const value = {
    products,
    getProducts,

    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    totalItems,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProduct = () => {
  return useContext(ProductContext);
};
