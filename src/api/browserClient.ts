import axios from "axios";

export const browserApiInstance = axios.create({
  baseURL: "/api",
  timeout: 12000,
  headers: { Accept: "application/json" },
});
