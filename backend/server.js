import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let orders = [];

// ➕ Create Order
app.post("/orders", (req, res) => {
  try {
    const { customerName, phone, items } = req.body;

    // ✅ Validation
    if (!customerName || !phone || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const validItems = items.filter(
      (i) =>
        i.type &&
        i.quantity > 0 &&
        i.price > 0
    );

    if (validItems.length === 0) {
      return res.status(400).json({ error: "No valid items" });
    }

    // ✅ Calculate total
    const total = validItems.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0
    );

    const order = {
      id: Date.now().toString(),
      customerName,
      phone,
      items: validItems,
      total,
      status: "RECEIVED",
      createdAt: new Date(),
    };

    orders.push(order);

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔍 Get Orders (Search + Filter)
app.get("/orders", (req, res) => {
  try {
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
  } catch {
    res.status(500).json({ error: "Error fetching orders" });
  }
});

// 🔄 Update Status
app.put("/orders/:id/status", (req, res) => {
  try {
    const { status } = req.body;

    orders = orders.map((o) =>
      o.id === req.params.id
        ? { ...o, status }
        : o
    );

    res.json({ message: "Updated" });
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

// ❌ Delete Order
app.delete("/orders/:id", (req, res) => {
  try {
    orders = orders.filter((o) => o.id !== req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

// 📊 Dashboard
app.get("/dashboard", (req, res) => {
  try {
    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.total || 0),
      0
    );

    const statusCount = {
      RECEIVED: 0,
      PROCESSING: 0,
      READY: 0,
      DELIVERED: 0,
    };

    orders.forEach((o) => {
      if (statusCount[o.status] !== undefined) {
        statusCount[o.status]++;
      }
    });

    res.json({
      totalOrders,
      totalRevenue,
      statusCount,
    });
  } catch {
    res.status(500).json({ error: "Dashboard error" });
  }
});

// ✅ Health check (important for Render)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);