import {
  ShoppingCart,
  Leaf,
  Menu,
  X,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Package,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import NavbarSkeleton from "./NavbarSkeleton";

const Navbar = () => {
  const { user, authLoading, authLogout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  if (authLoading) {
    return <NavbarSkeleton />;
  }

  const handleLogout = () => {
    authLogout();
    setProfileOpen(false);
    setMobileMenu(false);
    navigate("/login");
  };

  const closeMobile = () => {
    setMobileMenu(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-white">
            <Leaf size={19} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-950">
              cartora
            </h1>

            <p className="hidden text-[8px] font-medium tracking-[0.2em] text-gray-400 sm:block">
              SHOP NATURALLY
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            to="/"
            className={`relative rounded-lg px-4 py-2 text-sm transition-colors ${
              location.pathname === "/"
                ? "font-semibold text-gray-950"
                : "text-gray-600 hover:text-gray-950"
            }`}
          >
            {location.pathname === "/" && (
              <span className="absolute -left-0.5 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-gray-950" />
            )}
            Products
          </Link>

          <Link
            to="/categories"
            className={`relative rounded-lg px-4 py-2 text-sm transition-colors ${
              location.pathname === "/categories"
                ? "font-semibold text-gray-950"
                : "text-gray-600 hover:text-gray-950"
            }`}
          >
            {location.pathname === "/categories" && (
              <span className="absolute -left-0.5 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-gray-950" />
            )}
            Categories
          </Link>

          <Link
            to="/orders"
            className={`relative rounded-lg px-4 py-2 text-sm transition-colors ${
              location.pathname === "/orders"
                ? "font-semibold text-gray-950"
                : "text-gray-600 hover:text-gray-950"
            }`}
          >
            {location.pathname === "/orders" && (
              <span className="absolute -left-0.5 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-gray-950" />
            )}
            Orders
          </Link>
        </div>

        {/* Desktop Right */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-950"
          >
            <ShoppingCart size={19} />

            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-950 px-1 text-[9px] font-semibold text-white">
              3
            </span>
          </Link>

          {/* Auth */}
          {user === null ? (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                <LogIn size={16} />
                Login
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                <UserPlus size={16} />
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              {/* Profile Button */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-950 text-white">
                  <User size={14} />
                </div>

                <span className="max-w-24 truncate text-sm font-medium text-gray-700">
                  {user.username}
                </span>
              </button>

              {/* Profile Menu */}
              {profileOpen && (
                <div className="absolute right-0 top-12 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User size={16} />
                    Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Package size={16} />
                    My Orders
                  </Link>

                  <div className="my-1 border-t border-gray-100" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 md:hidden"
        >
          {mobileMenu ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              to="/products"
              onClick={closeMobile}
              className="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-100"
            >
              Products
            </Link>

            <Link
              to="/categories"
              onClick={closeMobile}
              className="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-100"
            >
              Categories
            </Link>

            <Link
              to="/orders"
              onClick={closeMobile}
              className="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-100"
            >
              Orders
            </Link>

            <Link
              to="/cart"
              onClick={closeMobile}
              className="flex items-center justify-between rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span className="flex items-center gap-3">
                <ShoppingCart size={17} />
                Cart
              </span>

              <span className="rounded-full bg-gray-950 px-2 py-0.5 text-[10px] text-white">
                3
              </span>
            </Link>

            <div className="my-2 border-t border-gray-100" />

            {user === null ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 text-sm font-medium text-gray-700"
                >
                  <LogIn size={16} />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gray-950 py-3 text-sm font-medium text-white"
                >
                  <UserPlus size={16} />
                  Register
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={closeMobile}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User size={17} />
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-lg bg-red-50 py-3 text-sm font-medium text-red-600"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
