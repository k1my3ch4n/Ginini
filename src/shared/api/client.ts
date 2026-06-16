import axios from "axios";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 120_000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number = error.response?.status ?? 0;
    const message: string =
      error.response?.data?.message ??
      error.message ??
      "요청에 실패했습니다. 다시 시도해 주세요.";
    return Promise.reject(new ApiError(status, message));
  },
);
