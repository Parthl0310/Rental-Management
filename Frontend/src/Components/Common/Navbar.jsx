import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Home, Store,  Heart, ShoppingCart, Menu, X, User, LogOut, ChevronDown, Search, Phone,
} from "lucide-react";
import { useAuth } from "../../Context/Auth.context";
import { logoutAPI } from "../../Api/Auth.api";
import { useCart } from "../../Context/CartContext";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const drawerRef = useRef(null);

  const { cartCount } = useCart();

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (err) {}

    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }

      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `transition font-medium duration-200 px-2 py-1 ${isActive ? "text-sky-600" : "text-slate-700 hover:text-sky-600"}`;

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto h-18 px-5 flex items-center justify-between gap-6">
          {/* ---------------- LEFT ---------------- */}

          <div className="flex items-center gap-10">
            {/* Logo */}

            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center shadow">
                <ShoppingCart className="text-white" size={20} />
              </div>

              <h1 className="text-2xl font-bold text-slate-800">
                Rentora
              </h1>
            </Link>

            {/* Desktop Navigation */}

            <nav className="hidden lg:flex items-center gap-8">
              <NavLink to="/customer/" className={navLinkClass}>
                Home
              </NavLink>

              <NavLink to="/customer/products" className={navLinkClass}>
                Rental Shop
              </NavLink>

              <NavLink to="/customer/wishlist" className={navLinkClass}>
                Wishlist
              </NavLink>
            </nav>
          </div>

          {/* ---------------- RIGHT ---------------- */}

          <div className="hidden lg:flex items-center gap-4">
            {/* Cart */}

            <Link to="/customer/cart" className="relative w-12 h-12 rounded-2xl border border-slate-200 bg-white flex items-center justify-center transition hover:bg-sky-50">
              <ShoppingCart size={22} className="text-slate-700" />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}

            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 px-3 h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition"
              >
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${user?.name || "U"}&background=0ea5e9&color=fff`
                  }
                  alt=""
                  className="w-9 h-9 rounded-full"
                />

                <span className="font-medium">
                  {user?.name || "User"}
                </span>

                <ChevronDown
                  size={18}
                  className={`transition ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-sky-50 transition"
                  >
                    <User size={20} />
                    My Profile
                  </Link>

                  <div className="border-t" />

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-5 py-4 text-red-500 hover:bg-red-50 transition"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Contact */}

            <button className="flex items-center gap-2 px-5 h-12 rounded-2xl border border-sky-200 text-sky-600 hover:bg-sky-50 transition">
              <Phone size={18} />
              Contact Us
            </button>
          </div>

          {/* ---------------- MOBILE HEADER ---------------- */}

          <div className="flex lg:hidden items-center gap-3">
            <Link to="/customer/cart" className="relative w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center bg-white">
              <ShoppingCart size={21} />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              className="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center bg-white"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>
            {/* ================= MOBILE DRAWER ================= */}

      <div
        className={`fixed inset-0 z-[999] transition-all duration-300 ${menuOpen ? "visible opacity-100 bg-black/40" : "invisible opacity-0"}`}
      >
        <div
          ref={drawerRef}
          className={`absolute left-0 top-0 h-full w-80 bg-white shadow-2xl transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Top */}

          <div className="flex items-center justify-between p-5 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">
                <ShoppingCart className="text-white" size={18} />
              </div>

              <span className="font-bold text-xl">Rentora</span>
            </div>

            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 rounded-xl border flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}

          <div className="p-5">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search products..."
                className="w-full h-11 rounded-xl border border-slate-200 pl-11 pr-3 outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* User */}

          <div className="px-5 pb-5">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.name || "U"}&background=0ea5e9&color=fff`
                }
                alt=""
                className="w-12 h-12 rounded-full"
              />

              <div>
                <h3 className="font-semibold">
                  {user?.name || "User"}
                </h3>

                <p className="text-sm text-slate-500">
                  Welcome back 👋
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}

          <div className="px-4 space-y-2">
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${isActive ? "bg-sky-500 text-white" : "hover:bg-slate-100"}`
              }
            >
              <Home size={20} />
              Home
            </NavLink>

            <NavLink
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${isActive ? "bg-sky-500 text-white" : "hover:bg-slate-100"}`
              }
            >
              <Store size={20} />
              Rental Shop
            </NavLink>

            <NavLink
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${isActive ? "bg-sky-500 text-white" : "hover:bg-slate-100"}`
              }
            >
              <Heart size={20} />
              Wishlist
            </NavLink>

            <NavLink
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100 transition"
            >
              <User size={20} />
              My Profile
            </NavLink>
          </div>

          {/* Bottom */}

          <div className="absolute bottom-0 left-0 w-full p-5 border-t bg-white">
            <button className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-sky-200 text-sky-600 hover:bg-sky-50 transition">
              <Phone size={18} />
              Contact Us
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="mt-3 w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}