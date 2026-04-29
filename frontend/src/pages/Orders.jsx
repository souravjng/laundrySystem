import { useEffect, useState } from "react";
import {
  getOrders,
  updateStatus,
  deleteOrder,
} from "../services/api";
import { Trash2, Download } from "lucide-react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Status styles
const statusStyles = {
  RECEIVED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-yellow-100 text-yellow-700",
  READY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getOrders({ search, status });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, newStatus) => {
    try {
      await updateStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: newStatus } : o
        )
      );
      toast.success("Updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return;

    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ✅ EXPORT TO EXCEL
  const exportExcel = () => {
    if (orders.length === 0) {
      toast.error("No data to export");
      return;
    }

    const data = orders.map((o) => ({
      Customer: o.customerName,
      Phone: o.phone,
      Total: o.total,
      Status: o.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "orders.xlsx");
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Orders</h2>

        <button
          onClick={exportExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer"
        >
          <Download size={16} />
          Export Excel
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search..."
          className="border border-gray-300 p-2 rounded w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-gray-300 p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
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
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
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
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">
                    {o.customerName}
                  </td>

                  <td className="p-3 text-center">{o.phone}</td>

                  <td className="p-3 text-center font-semibold">
                    ₹{o.total}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        statusStyles[o.status]
                      }`}
                    >
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}