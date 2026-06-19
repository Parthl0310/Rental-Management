import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  PackageCheck,
  ClipboardList,
  Package,
  BarChart3,
  Settings,
  ShoppingCart,
} from "lucide-react";

import { useAuth } from "../../Context/Auth.context";
import { logoutAPI } from "../../Api/Auth.api";

export default function Sidebar() {
  const { user, setUser } = useAuth();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const drawerRef = useRef(null);

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (err) {}

    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }

      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Rental",
      path: "/admin/orders",
      icon: PackageCheck,
    },
    {
      label: "Order",
      path: "/admin/order",
      icon: ClipboardList,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      label: "Reporting",
      path: "/admin/reports",
      icon: BarChart3,
    },
    {
      label: "PriceList",
      path: "/admin/pricelists",
      icon: BarChart3,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  const navLinkClass = ({ isActive }) =>
    `transition font-medium duration-200 px-3 py-2 rounded-xl ${
      isActive
        ? "bg-sky-100 text-sky-600"
        : "text-slate-700 hover:text-sky-600 hover:bg-slate-100"
    }`;

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <header className="sticky top-0 z-50 bg-white border-b border-slate-300 shadow-sm">
        <div className="max-w-7xl mx-auto h-19 px-6 flex items-center justify-between">

          {/* LEFT */}

          <div className="flex items-center gap-10">

            {/* LOGO */}

            <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center shadow">
              <ShoppingCart className="text-white" size={20} />
            </div>

            <h1 className="text-2xl font-bold text-slate-800">
              Rentora
            </h1>
          </Link>

            {/* DESKTOP NAV */}

            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={navLinkClass}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* RIGHT */}

          <div className="hidden lg:flex items-center gap-6">

            {/* PROFILE */}

            <div
              ref={profileRef}
              className="relative"
            >
              <button
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                className="flex items-center gap-3 px-3 h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition"
              >
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${
                      user?.name || "A"
                    }&background=0ea5e9&color=fff`
                  }
                  alt=""
                  className="w-9 h-9 rounded-full"
                />

                <span className="font-medium">
                  {user?.name || "Admin"}
                </span>

                <ChevronDown
                  size={18}
                  className={`transition ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>
                            {profileOpen && (
                <div className="absolute right-0 mt-3 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">

                  <Link
                    to="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-sky-50 transition"
                  >
                    <User size={18} />
                    Edit Profile
                  </Link>

                  <div className="border-t border-slate-100" />

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-5 py-4 text-red-500 hover:bg-red-50 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>

                </div>
              )}
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center bg-white"
          >
            <Menu size={22} />
          </button>

        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}

      <div
        className={`fixed inset-0 z-[999] transition-all duration-300 ${
          menuOpen
            ? "visible opacity-100 bg-black/40"
            : "invisible opacity-0"
        }`}
      >
        <div
          ref={drawerRef}
          className={`absolute left-0 top-0 h-full w-80 bg-white shadow-2xl transition-transform duration-300 ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >

          {/* DRAWER HEADER */}

          <div className="flex items-center justify-between p-5 border-b">

            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3"
            >
              <img
                src="/logo.png"
                alt="Rentora"
                className="h-10 w-10 object-contain"
              />

              <span className="font-bold text-xl">
                Rentora
              </span>
            </Link>

            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 rounded-xl border flex items-center justify-center"
            >
              <X size={20} />
            </button>

          </div>

          {/* USER INFO */}

          <div className="p-5 border-b">

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">

              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${
                    user?.name || "A"
                  }&background=0ea5e9&color=fff`
                }
                alt=""
                className="w-12 h-12 rounded-full"
              />

              <div>
                <h3 className="font-semibold">
                  {user?.name || "Admin"}
                </h3>

                <p className="text-sm text-slate-500">
                  Administrator
                </p>
              </div>

            </div>

          </div>

          {/* MOBILE NAVIGATION */}

          <div className="p-4 space-y-2">

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                      isActive
                        ? "bg-sky-500 text-white"
                        : "hover:bg-slate-100 text-slate-700"
                    }`
                  }
                >
                  <Icon size={20} />
                  {item.label}
                </NavLink>
              );
            })}

            <Link
              to="/admin/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100 transition"
            >
              <User size={20} />
              Edit Profile
            </Link>

          </div>

          {/* BOTTOM */}

          <div className="absolute bottom-0 left-0 w-full p-5 border-t bg-white">

            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
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