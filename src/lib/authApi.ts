import axios from "axios";
import { env } from "@/config/env";
import { ApiError } from "@/lib/api";

export const authApi = axios.create({
  baseURL: env.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

authApi.interceptors.response.use(
  (res) => res,
  (err) =>
    Promise.reject(
      new ApiError(
        err.message,
        err.response?.status,
        undefined,
        err.response?.data,
      ),
    ),
);
