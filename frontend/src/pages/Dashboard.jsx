import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";
import Card from "../components/Card";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboard().then(res => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-3 gap-6">
        <Card title="Total Orders" value={data.totalOrders} />
        <Card title="Total Revenue" value={`₹${data.totalRevenue}`} />
        <Card title="Delivered Orders" value={data.statusCount.DELIVERED} />
      </div>

      {/* Status Breakdown */}
      <div className="mt-8 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="font-semibold mb-4">Order Status</h3>

        <div className="grid grid-cols-4 gap-4">
          {Object.entries(data.statusCount).map(([key, val]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">{key}</p>
              <p className="text-xl font-bold">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}