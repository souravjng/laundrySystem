import { useEffect, useState } from "react";
import {
  getOrders,
  updateStatus,
  deleteOrder,
} from "../services/api";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const load = async () => {
    const res = await getOrders({ search, status });
    setOrders(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, newStatus) => {
    await updateStatus(id, newStatus);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: newStatus } : o
      )
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return;

    await deleteOrder(id);
    toast.success("Order deleted");

    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search name or phone..."
          className="border p-2 rounded w-1/2"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option>RECEIVED</option>
          <option>PROCESSING</option>
          <option>READY</option>
          <option>DELIVERED</option>
        </select>

        <button
          onClick={load}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Apply
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-center">Phone</th>
            <th className="p-3 text-center">Total</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Update</th>
            <th className="p-3 text-center">Delete</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{o.customerName}</td>
              <td className="p-3 text-center">{o.phone}</td>
              <td className="p-3 text-center">₹{o.total}</td>

              <td className="p-3 text-center">
                <span className="px-2 py-1 bg-gray-200 rounded">
                  {o.status}
                </span>
              </td>

              <td className="p-3 text-center">
                <select
                  value={o.status}
                  onChange={(e) =>
                    changeStatus(o.id, e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                >
                  <option>RECEIVED</option>
                  <option>PROCESSING</option>
                  <option>READY</option>
                  <option>DELIVERED</option>
                </select>
              </td>

              <td className="p-3 text-center">
                <button
                  onClick={() => handleDelete(o.id)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <p className="text-center mt-4 text-gray-500">
          No orders found
        </p>
      )}
    </div>
  );
}