import { useState } from "react";
import CreateOrder from "./pages/CreateOrder";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("dashboard");

  const menu = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Orders", key: "orders" },
    { name: "Create Order", key: "create" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-300 p-5">
        <h1 className="text-2xl font-bold text-blue-900 mb-8">
          Laundry Admin
        </h1>

        <nav className="space-y-2">
          {menu.map(item => (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={`w-full text-left px-4 py-2 rounded-lg transition cursor-pointer ${
                page === item.key
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar */}
        <div className="bg-white p-4 border-b border-gray-300 flex justify-between">
          <h2 className="font-semibold capitalize">{page}</h2>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>

        {/* Content */}
        <div className="p-6 border-t border-gray-200">
          {page === "dashboard" && <Dashboard />}
          {page === "orders" && <Orders />}
          {page === "create" && <CreateOrder />}
        </div>
      </div>
    </div>
  );
}