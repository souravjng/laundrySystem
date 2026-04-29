import { useEffect, useState } from "react";
import { getDashboard, getOrders } from "../services/api";
import Card from "../components/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setData({}));
  }, []);

  const statusStyles = {
    RECEIVED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-yellow-100 text-yellow-700",
    READY: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
  };

  const chartColors = ["#3B82F6", "#F59E0B", "#8B5CF6", "#22C55E"];

  // ✅ SAFE DEFAULTS
  const statusCount = data?.statusCount || {
    RECEIVED: 0,
    PROCESSING: 0,
    READY: 0,
    DELIVERED: 0,
  };

  const totalOrders = data?.totalOrders || 0;
  const totalRevenue = data?.totalRevenue || 0;

  const chartData = Object.entries(statusCount).map(
    ([key, val]) => ({
      name: key,
      value: val,
    })
  );

  // ✅ EXCEL DOWNLOAD FUNCTION
  const downloadExcel = async () => {
    try {
      const res = await getOrders(); // get all orders
      const orders = res.data || [];

      if (orders.length === 0) {
        toast.error("No data to download");
        return;
      }

      // format data
      const formatted = orders.map((o) => ({
        Customer: o.customerName,
        Phone: o.phone,
        Total: o.total,
        Status: o.status,
      }));

      const worksheet = XLSX.utils.json_to_sheet(formatted);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

      XLSX.writeFile(workbook, "Orders_Data.xlsx");

      toast.success("Excel downloaded");
    } catch (err) {
      toast.error("Download failed");
    }
  };

  // ✅ Loading UI
  if (!data) {
    return (
      <div className="p-6 text-gray-500 animate-pulse">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      {/* Header with Excel Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Dashboard Overview
        </h2>

        {/* ✅ EXCEL BUTTON (GREEN ICON ONLY) */}
        <button
          onClick={downloadExcel}
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg flex items-center justify-center"
        >
          <Download size={18} />
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card title="Total Orders" value={totalOrders} />
        <Card title="Revenue" value={`₹${totalRevenue}`} />
        <Card
          title="Delivered"
          value={statusCount.DELIVERED}
        />
      </div>

      {/* Status Section */}
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
        <h3 className="font-semibold mb-4">Order Status</h3>

        <div className="grid grid-cols-4 gap-4">
          {Object.entries(statusCount).map(([key, val]) => (
            <div
              key={key}
              className={`p-4 rounded-xl text-center border border-gray-200 ${statusStyles[key]}`}
            >
              <p className="text-sm">{key}</p>
              <p className="text-xl font-bold">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
          <h3 className="mb-4 font-semibold">Orders by Status</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={chartColors[i % chartColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
          <h3 className="mb-4 font-semibold">Distribution</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {chartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={chartColors[i % chartColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}