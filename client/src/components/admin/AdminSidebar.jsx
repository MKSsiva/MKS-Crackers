import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: "📊", },
    { name: "Hero", path: "/admin/homepage/hero", icon: "🖼️" },
    { name: "Promo Banner", path: "/admin/homepage/promo", icon: "🎁" },
    { name: "Homepage Features", path: "/admin/homepage/features", icon: "⭐", },
    { name: "Categories", path: "/admin/categories", icon: "📂", },
    { name: "Products", path: "/admin/products", icon: "🎆", },
    { name: "Orders", path: "/admin/orders", icon: "📦", },
    { name: "Customers", path: "/admin/customers", icon: "👥", },
    { name: "Offers", path: "/admin/offers", icon: "🎁", },
    { name: "Settings", path: "/admin/settings", icon: "⚙️", },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-800 px-5">
        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-xl">
          🎆
        </div>

        <div>
          <h2 className="text-lg font-bold">
            MKS Crackers
          </h2>

          <p className="text-xs text-gray-400">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Admin Information */}
      <div className="border-b border-gray-800 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-lg">
            👤
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name || "Administrator"}
            </p>

            <p className="truncate text-xs text-gray-400">
              {user?.email || "Admin Account"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Management
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <span className="flex w-6 justify-center text-lg">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-gray-800 p-3">
        {/* View Store */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
        >
          <span className="flex w-6 justify-center text-lg">
            🌐
          </span>

          <span>View Store</span>
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-300 transition hover:bg-red-600 hover:text-white"
        >
          <span className="flex w-6 justify-center text-lg">
            🚪
          </span>

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;