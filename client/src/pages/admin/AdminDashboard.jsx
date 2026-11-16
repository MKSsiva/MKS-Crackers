import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getAdminDashboardStats } from "../../services/api";

const AdminDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    customers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminDashboardStats();

        if (response.success) {
          setStats(response.stats);
        } else {
          setError(
            response.message ||
              "Failed to load dashboard statistics."
          );
        }
      } catch (error) {
        console.error(
          "Dashboard statistics error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.products,
      icon: "🎆",
      description: "Products in your store",
    },
    {
      title: "Total Categories",
      value: stats.categories,
      icon: "📂",
      description: "Categories in your store",
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: "📦",
      description: "Orders received",
    },
    {
      title: "Customers",
      value: stats.customers,
      icon: "👥",
      description: "Registered customers",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.name || "Administrator"}.
          Here's what's happening with your store.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading ? "..." : stat.value}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl">
                {stat.icon}
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-400">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Quickly manage important parts of your store.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/admin/homepage/features"
            className="rounded-xl border border-gray-200 p-4 transition hover:border-red-300 hover:bg-red-50"
          >
            <div className="mb-3 text-2xl">🏠</div>

            <h3 className="font-semibold text-gray-900">
              Homepage
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Manage homepage content
            </p>
          </Link>

          <Link
            to="/admin/categories"
            className="rounded-xl border border-gray-200 p-4 transition hover:border-red-300 hover:bg-red-50"
          >
            <div className="mb-3 text-2xl">📂</div>

            <h3 className="font-semibold text-gray-900">
              Categories
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Manage product categories
            </p>
          </Link>

          <Link
            to="/admin/products"
            className="rounded-xl border border-gray-200 p-4 transition hover:border-red-300 hover:bg-red-50"
          >
            <div className="mb-3 text-2xl">🎆</div>

            <h3 className="font-semibold text-gray-900">
              Products
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Manage store products
            </p>
          </Link>

          <Link
            to="/admin/orders"
            className="rounded-xl border border-gray-200 p-4 transition hover:border-red-300 hover:bg-red-50"
          >
            <div className="mb-3 text-2xl">📦</div>

            <h3 className="font-semibold text-gray-900">
              Orders
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Manage customer orders
            </p>
          </Link>
        </div>
      </div>

      {/* Store Status */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Store Status
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your MKS Crackers store is currently
              operational.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>

            <span className="text-sm font-semibold text-green-700">
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;