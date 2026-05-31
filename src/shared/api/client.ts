import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 60_000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      "요청에 실패했습니다. 다시 시도해 주세요.";
    return Promise.reject(new Error(message));
  },
);
