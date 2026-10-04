import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { ProductContextProvider } from "./context/ProductContext.jsx";
import { WishlistContextProvider } from "./context/WishlistContext.jsx";
import { ToastContextProvider } from "./context/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContextProvider>
      <AuthContextProvider>
        <ProductContextProvider>
          <WishlistContextProvider>
            <App />
          </WishlistContextProvider>
        </ProductContextProvider>
      </AuthContextProvider>
    </ToastContextProvider>
  </StrictMode>,
);
