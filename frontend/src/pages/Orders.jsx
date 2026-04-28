import { useEffect, useState } from "react";
import { getOrders, updateStatus } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import TableSkeleton from "../components/TableSkeleton";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await updateStatus(id, status);

      setOrders(prev =>
        prev.map(o => (o.id === id ? { ...o, status } : o))
      );

      toast.success("Status updated");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-300"
    >
      <h2 className="text-xl font-semibold mb-4">Orders</h2>

      {loading ? (
        <TableSkeleton />
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-center">Total</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{o.customerName}</td>
                <td className="p-3 text-center">₹{o.total}</td>

                <td className="p-3 text-center">
                  <StatusBadge status={o.status} />
                </td>

                <td className="p-3 text-center">
                  <select
                    value={o.status}
                    onChange={e =>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}