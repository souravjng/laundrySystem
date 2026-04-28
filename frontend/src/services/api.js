import axios from "axios";

const API = axios.create({
  baseURL: "https://laundrysystem-58t9.onrender.com",
});

export const createOrder = (data) => API.post("/orders", data);
export const getOrders = (params) => API.get("/orders", { params });
export const updateStatus = (id, status) =>
  API.put(`/orders/${id}/status`, { status });

export const getDashboard = () => API.get("/dashboard");