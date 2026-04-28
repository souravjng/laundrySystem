import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const createOrder = (data) =>
  API.post("/orders", data);

export const getOrders = (params) =>
  API.get("/orders", { params });

export const updateStatus = (id, status) =>
  API.put(`/orders/${id}/status`, { status });

export const deleteOrder = (id) =>
  API.delete(`/orders/${id}`);

export const getDashboard = () =>
  API.get("/dashboard");