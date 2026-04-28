import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

let orders = [];

// CREATE ORDER
app.post("/orders", (req, res) => {
  const { customerName, phone, items } = req.body;

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const order = {
    id: uuidv4(),
    customerName,
    phone,
    items,
    total,
    status: "RECEIVED",
  };

  orders.push(order);
  res.json(order);
});

// GET ORDERS (FILTER)
app.get("/orders", (req, res) => {
  const { status, search } = req.query;

  let result = orders;

  if (status) {
    result = result.filter(o => o.status === status);
  }

  if (search) {
    result = result.filter(o =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search)
    );
  }

  res.json(result);
});

// UPDATE STATUS
app.put("/orders/:id/status", (req, res) => {
  const { status } = req.body;

  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).send("Order not found");

  order.status = status;
  res.json(order);
});

// DASHBOARD
app.get("/dashboard", (req, res) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const statusCount = {
    RECEIVED: 0,
    PROCESSING: 0,
    READY: 0,
    DELIVERED: 0,
  };

  orders.forEach(o => statusCount[o.status]++);

  res.json({ totalOrders, totalRevenue, statusCount });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));