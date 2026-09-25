import React from "react";
import {
  HeroPage,
  LoginPage,
  RegisterPage,
  NotFoundPage,
  CartPage,
  AdminHome,
  EditProduct,
} from "./pages/index";

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
      { path: "/", element: <HeroPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/admin", element: <AdminHome /> },
      { path: "/admin/edit/:id", element: <EditProduct /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
