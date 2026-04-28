const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let orders = [];

// ➕ Create Order
app.post("/orders", (req, res) => {
  const { customerName, phone, items } = req.body;

  const total = items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  );

  const order = {
    id: Date.now(),
    customerName,
    phone,
    items,
    total,
    status: "RECEIVED",
  };

  orders.push(order);
  res.json(order);
});

// 🔍 Get Orders (Search + Filter)
app.get("/orders", (req, res) => {
  let { search, status } = req.query;

  let result = [...orders];

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (o) =>
        o.customerName.toLowerCase().includes(s) ||
        o.phone.includes(s)
    );
  }

  if (status) {
    result = result.filter((o) => o.status === status);
  }

  res.json(result);
});

// 🔄 Update Status
app.put("/orders/:id/status", (req, res) => {
  const { status } = req.body;

  orders = orders.map((o) =>
    o.id == req.params.id ? { ...o, status } : o
  );

  res.json({ message: "Updated" });
});

// ❌ Delete Order
app.delete("/orders/:id", (req, res) => {
  orders = orders.filter((o) => o.id != req.params.id);
  res.json({ message: "Deleted" });
});

// 📊 Dashboard
app.get("/dashboard", (req, res) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.total,
    0
  );

  const statusCount = {
    RECEIVED: 0,
    PROCESSING: 0,
    READY: 0,
    DELIVERED: 0,
  };

  orders.forEach((o) => {
    statusCount[o.status]++;
  });

  res.json({ totalOrders, totalRevenue, statusCount });
});

app.listen(5000, () =>
  console.log("Server running on port 5000")
);