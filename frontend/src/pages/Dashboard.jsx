import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";
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

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboard().then((res) => setData(res.data));
  }, []);

  const statusStyles = {
    RECEIVED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-yellow-100 text-yellow-700",
    READY: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
  };

  const chartColors = ["#3B82F6", "#F59E0B", "#8B5CF6", "#22C55E"];

  // Prepare chart data
  const chartData = data
    ? Object.entries(data.statusCount).map(([key, val]) => ({
        name: key,
        value: val,
      }))
    : [];

  // Skeleton
  if (!data) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-6">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-gray-300 animate-pulse"
            >
              <div className="h-4 bg-gray-200 mb-4"></div>
              <div className="h-8 bg-gray-300"></div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-300 animate-pulse">
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Dashboard Overview
      </h2>

      {/* Top Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card title="Total Orders" value={data.totalOrders} />
        <Card title="Total Revenue" value={`₹${data.totalRevenue}`} />
        <Card
          title="Delivered Orders"
          value={data.statusCount.DELIVERED}
        />
      </div>

      {/* Status Cards */}
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
        <h3 className="font-semibold mb-4">Order Status</h3>

        <div className="grid grid-cols-4 gap-4">
          {Object.entries(data.statusCount).map(([key, val]) => (
            <div
              key={key}
              className={`p-4 rounded-xl text-center border border-gray-200 transition hover:scale-105 ${statusStyles[key]}`}
            >
              <p className="text-sm">{key}</p>
              <p className="text-xl font-bold">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
          <h3 className="font-semibold mb-4">
            Orders by Status (Bar)
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
          <h3 className="font-semibold mb-4">
            Orders Distribution
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={chartColors[index % chartColors.length]}
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