import { useState } from "react";
import { createOrder } from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function CreateOrder() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState([
    { type: "Shirt", quantity: 1, price: 50 },
  ]);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([...items, { type: "", quantity: 1, price: 0 }]);
  };

  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const submit = async () => {
    try {
      setLoading(true);

      const res = await createOrder({
        customerName: name,
        phone,
        items,
      });

      toast.success(`Order Created! ID: ${res.data.id}`);

      setName("");
      setPhone("");
      setItems([{ type: "Shirt", quantity: 1, price: 50 }]);
    } catch (err) {
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border max-w-xl"
    >
      <h2 className="text-xl font-semibold mb-4">Create Order</h2>

      <input
        placeholder="Customer Name"
        className="w-full border p-2 rounded mb-3"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        placeholder="Phone"
        className="w-full border p-2 rounded mb-3"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />

      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-3 gap-2 mb-2">
          <input
            className="border p-2 rounded"
            value={item.type}
            onChange={e => {
              const newItems = [...items];
              newItems[i].type = e.target.value;
              setItems(newItems);
            }}
          />
          <input
            type="number"
            className="border p-2 rounded"
            value={item.quantity}
            onChange={e => {
              const newItems = [...items];
              newItems[i].quantity = +e.target.value;
              setItems(newItems);
            }}
          />
          <input
            type="number"
            className="border p-2 rounded"
            value={item.price}
            onChange={e => {
              const newItems = [...items];
              newItems[i].price = +e.target.value;
              setItems(newItems);
            }}
          />
        </div>
      ))}

      <button
        onClick={addItem}
        className="bg-gray-200 px-3 py-1 rounded mb-3"
      >
        + Add Item
      </button>

      <p className="font-semibold mb-3">Total: ₹{total}</p>

      <button
        onClick={submit}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
      >
        {loading ? "Submitting..." : "Submit Order"}
      </button>
    </motion.div>
  );
}