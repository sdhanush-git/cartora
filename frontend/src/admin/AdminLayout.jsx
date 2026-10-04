import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Users,
  ShoppingBag,
  LogOut,
  Store,
  Menu,
  X,
} from "lucide-react";

export const AdminLayout = () => {
  const { authLogout } = useAuth();
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Add Product", path: "/admin/products/add", icon: PlusCircle },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
  ];

  const closeDrawer = () => setMobileDrawerOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white md:flex">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <Link to="/" className="text-lg font-bold tracking-tight text-gray-900">
            Cartora Admin
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-gray-900" : "text-gray-400"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4 space-y-1">
          <Link
            to="/"
            className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <Store className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
            View Store
          </Link>
          <button
            onClick={authLogout}
            className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-red-500" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          onClick={closeDrawer}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-gray-200 shadow-xl transition-transform duration-300 md:hidden ${
          mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Cartora Admin
          </span>
          <button
            onClick={closeDrawer}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeDrawer}
                className={`flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-950 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-gray-900" : "text-gray-400"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4 space-y-1">
          <Link
            to="/"
            onClick={closeDrawer}
            className="flex w-full items-center rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <Store className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
            View Store
          </Link>
          <button
            onClick={() => {
              closeDrawer();
              authLogout();
            }}
            className="flex w-full items-center rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-red-500" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile Header Bar */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
              aria-label="Open Admin Menu"
            >
              <Menu size={22} />
            </button>
            <Link to="/admin" className="text-base font-bold text-gray-900">
              Cartora Admin
            </Link>
          </div>
          <Link
            to="/"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Store
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
export default AdminLayout;
