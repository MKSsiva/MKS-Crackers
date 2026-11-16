import { Outlet } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Admin Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              MKS Crackers Admin
            </h1>

            <p className="text-xs text-gray-500">
              Store Management Panel
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-700">
                Administrator
              </p>

              <p className="text-xs text-gray-500">
                Admin Account
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-lg">
              👤
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;