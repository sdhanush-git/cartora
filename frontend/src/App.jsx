import React from "react";
import {
  LoginPage,
  RegisterPage,
  NotFoundPage,
  CartPage,
  AdminHome,
  EditProduct,
  CheckoutPage,
  OrdersPage,
  OrderDetailsPage,
  ProductDetailsPage,
  WishlistPage,
  ProfilePage,
  CategoriesPage,
} from "./pages/index";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import ProductsPage from "./pages/ProductsPage";
import { AdminLayout } from "./admin/AdminLayout";
import { AdminDashboard } from "./admin/AdminDashboard";
import { AdminProducts } from "./admin/AdminProducts";
import { AdminAddProduct } from "./admin/AdminAddProduct";
import { AdminEditProduct } from "./admin/AdminEditProduct";
import { AdminUsers } from "./admin/AdminUsers";
import { AdminOrders } from "./admin/AdminOrders";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <ProductsPage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/categories", element: <CategoriesPage /> },
      { path: "/products/:id", element: <ProductDetailsPage /> },
      { path: "/search", element: <ProductsPage /> },
      { path: "/category/:categoryParam", element: <ProductsPage /> },
      { path: "/wishlist", element: <WishlistPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/orders", element: <OrdersPage /> },
      { path: "/orders/:id", element: <OrderDetailsPage /> },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedAdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "products", element: <AdminProducts /> },
          { path: "products/add", element: <AdminAddProduct /> },
          { path: "products/edit/:id", element: <AdminEditProduct /> },
          { path: "users", element: <AdminUsers /> },
          { path: "orders", element: <AdminOrders /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
