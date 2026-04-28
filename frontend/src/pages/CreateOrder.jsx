import { useState } from "react";
import { createOrder } from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

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

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const total = items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  );

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
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-300 max-w-3xl mx-auto relative"
    >
      <h2 className="text-2xl font-semibold mb-6">
        Create Order
      </h2>

      {/* Customer Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-600">
            Customer Name
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Phone Number
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Garments */}
      <div className="mb-6">
        <h3 className="font-medium mb-4">Garments</h3>

        {items.map((item, i) => (
          <div
            key={i}
            className="border border-gray-300 rounded-xl p-4 mb-3 bg-gray-50 flex items-center gap-3"
          >
            <input
              placeholder="Type"
              className="border border-gray-300 p-2 rounded w-1/3"
              value={item.type}
              onChange={(e) => {
                const newItems = [...items];
                newItems[i].type = e.target.value;
                setItems(newItems);
              }}
            />

            <input
              type="number"
              placeholder="Qty"
              className="border border-gray-300 p-2 rounded w-1/4"
              value={item.quantity}
              onChange={(e) => {
                const newItems = [...items];
                newItems[i].quantity = +e.target.value;
                setItems(newItems);
              }}
            />

            <input
              type="number"
              placeholder="Price"
              className="border border-gray-300 p-2 rounded w-1/4"
              value={item.price}
              onChange={(e) => {
                const newItems = [...items];
                newItems[i].price = +e.target.value;
                setItems(newItems);
              }}
            />

            {/* 🔴 DELETE BUTTON */}
            <div className="flex justify-center items-center w-10 h-10">
              <button
                onClick={() => removeItem(i)}
                className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 transition cursor-pointer flex items-center justify-center"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addItem}
          className="text-blue-600 hover:underline text-sm cursor-pointer "
        >
          + Add Garment
        </button>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-6 border-t pt-4">
        <p className="text-gray-600">Total Amount</p>
        <p className="text-xl font-bold">₹{total}</p>
      </div>

      {/* Submit */}
      <button
        onClick={submit}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg w-full font-medium cursor-pointer"
      >
        {loading ? "Submitting..." : "Submit Order"}
      </button>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl">
          <div className="animate-pulse text-gray-600">
            Processing...
          </div>
        </div>
      )}
    </motion.div>
  );
}