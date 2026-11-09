import axios from "axios";

export const apiInstance = axios.create({
  baseURL: process.env.FAKE_STORE_API_URL || "https://fakestoreapi.com",
  timeout: 10000,
  headers: { Accept: "application/json" },
});
