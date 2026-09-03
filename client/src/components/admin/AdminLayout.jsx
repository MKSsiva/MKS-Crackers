import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Admin Header */}
      <header className="border-b bg-[#080a18] px-6 py-4 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <div>
            <h1 className="text-xl font-black">
              MKS Crackers
            </h1>

            <p className="text-xs text-gray-400">
              Administration Panel
            </p>
          </div>

          <div className="text-sm">
            Admin
          </div>

        </div>
      </header>

      {/* Admin Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;