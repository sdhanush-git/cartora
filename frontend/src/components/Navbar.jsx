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
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/85 backdrop-blur-xl">
      {/* Main Navbar */}
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ================= LOGO ================= */}
        <Link to="/" className="group flex items-center gap-2">
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl bg-gray-950 text-white
              transition-all duration-300
              group-hover:-rotate-6 group-hover:scale-105
            "
          >
            <Leaf
              size={21}
              strokeWidth={2.2}
              className="transition-transform duration-300 group-hover:rotate-12"
            />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold tracking-tight text-gray-950">
              cartora
            </span>

            <span className="hidden text-[9px] font-medium uppercase tracking-[0.25em] text-gray-400 sm:block">
              shop naturally
            </span>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            to="/products"
            className="
              rounded-xl px-4 py-2 text-sm font-medium text-gray-600
              transition-all duration-200
              hover:bg-gray-100 hover:text-gray-950
            "
          >
            Products
          </Link>

          <Link
            to="/categories"
            className="
              rounded-xl px-4 py-2 text-sm font-medium text-gray-600
              transition-all duration-200
              hover:bg-gray-100 hover:text-gray-950
            "
          >
            Categories
          </Link>

          <Link
            to="/orders"
            className="
              rounded-xl px-4 py-2 text-sm font-medium text-gray-600
              transition-all duration-200
              hover:bg-gray-100 hover:text-gray-950
            "
          >
            Orders
          </Link>

          {/* Admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className="
                ml-1 flex items-center gap-2 rounded-xl
                bg-gray-100 px-4 py-2 text-sm font-semibold
                text-gray-800 transition-all duration-200
                hover:bg-gray-950 hover:text-white
              "
            >
              <LayoutDashboard size={16} />
              Admin
            </Link>
          )}
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Cart */}
          <Link
            to="/cart"
            className="
              group relative flex h-10 w-10 items-center
              justify-center rounded-xl text-gray-600
              transition-all duration-200
              hover:bg-gray-100 hover:text-gray-950
            "
          >
            <ShoppingCart
              size={20}
              className="transition-transform duration-200 group-hover:-rotate-6"
            />

            {/* Mock Cart Count */}
            <span
              className="
                absolute -right-1 -top-1 flex h-5 min-w-5
                items-center justify-center rounded-full
                bg-gray-950 px-1 text-[10px] font-bold text-white
              "
            >
              3
            </span>
          </Link>

          {/* ================= AUTH ================= */}

          {user === null ? (
            <>
              <Link
                to="/login"
                className="
                  flex items-center gap-2 rounded-xl
                  px-4 py-2 text-sm font-semibold
                  text-gray-700 transition-all duration-200
                  hover:bg-gray-100
                "
              >
                <LogIn size={16} />
                Login
              </Link>

              <Link
                to="/register"
                className="
                  flex items-center gap-2 rounded-xl
                  bg-gray-950 px-4 py-2.5
                  text-sm font-semibold text-white
                  shadow-sm transition-all duration-300
                  hover:-translate-y-0.5 hover:bg-gray-800
                  hover:shadow-lg
                "
              >
                <UserPlus size={16} />
                Register
              </Link>
            </>
          ) : (
            /* ================= LOGGED IN ================= */
            <div className="relative ml-1">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="
                  flex items-center gap-2 rounded-xl
                  border border-gray-200 px-3 py-2
                  transition-all duration-200
                  hover:bg-gray-50
                "
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-950 text-white">
                  <User size={15} />
                </div>

                <span className="text-sm font-semibold text-gray-800">
                  {user.username}
                </span>

                <ChevronDown
                  size={15}
                  className={`transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div
                  className="
                    absolute right-0 top-12 w-48
                    overflow-hidden rounded-2xl
                    border border-gray-200 bg-white
                    p-1.5 shadow-xl
                    animate-in fade-in slide-in-from-top-2
                    duration-200
                  "
                >
                  <Link
                    to="/profile"
                    className="
                      flex items-center gap-3 rounded-xl
                      px-3 py-2.5 text-sm text-gray-700
                      hover:bg-gray-100
                    "
                  >
                    <User size={16} />
                    Profile
                  </Link>

                  <Link
                    to="/orders"
                    className="
                      flex items-center gap-3 rounded-xl
                      px-3 py-2.5 text-sm text-gray-700
                      hover:bg-gray-100
                    "
                  >
                    <Package size={16} />
                    My Orders
                  </Link>

                  <button
                    onClick={logout}
                    className="
                      flex w-full items-center gap-3
                      rounded-xl px-3 py-2.5
                      text-sm text-red-600
                      hover:bg-red-50
                    "
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= MOBILE BUTTON ================= */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl text-gray-800
            transition-all duration-200
            hover:bg-gray-100
            md:hidden
          "
        >
          {mobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenu && (
        <div
          className="
            border-t border-gray-100 bg-white
            px-4 pb-5 pt-3
            shadow-lg md:hidden
            animate-in slide-in-from-top-2 fade-in
            duration-200
          "
        >
          <div className="flex flex-col gap-1">
            <Link
              to="/products"
              className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-100"
            >
              Products
            </Link>

            <Link
              to="/categories"
              className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-100"
            >
              Categories
            </Link>

            <Link
              to="/cart"
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-100"
            >
              <span className="flex items-center gap-3">
                <ShoppingCart size={18} />
                Cart
              </span>

              <span className="rounded-full bg-gray-950 px-2 py-0.5 text-xs text-white">
                3
              </span>
            </Link>

            <Link
              to="/orders"
              className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-100"
            >
              Orders
            </Link>

            {/* Mobile Admin */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-gray-100"
              >
                <LayoutDashboard size={18} />
                Admin Dashboard
              </Link>
            )}

            <div className="my-2 h-px bg-gray-100" />

            {user === null ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="
                    flex items-center justify-center gap-2
                    rounded-xl border border-gray-200
                    px-4 py-3 text-sm font-semibold
                    hover:bg-gray-50
                  "
                >
                  <LogIn size={16} />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                    flex items-center justify-center gap-2
                    rounded-xl bg-gray-950
                    px-4 py-3 text-sm font-semibold text-white
                    hover:bg-gray-800
                  "
                >
                  <UserPlus size={16} />
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={logout}
                className="
                  flex items-center justify-center gap-2
                  rounded-xl bg-red-50 px-4 py-3
                  text-sm font-semibold text-red-600
                "
              >
                <LogOut size={17} />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
