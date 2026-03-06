import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetToLogin } from "../navigation/navigationRef";

const PUBLIC_ENDPOINTS = ["/users/login", "/users/register", "/otp/send"];

export const api = axios.create({
  baseURL: "http://10.0.2.2:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(async (config) => {
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.startsWith(url));

  if (isPublic) return config;

  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // ❌ Token hết hạn / sai
      await AsyncStorage.removeItem("token");

      // 🚀 Đá về Login + clear stack
      resetToLogin();
    }

    return Promise.reject(error);
  },
);
