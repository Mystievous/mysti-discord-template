import type { AxiosRequestConfig } from "axios";
import { api } from "../axios";

// A tiny wrapper so Orval-generated code uses our configured Axios instance
export const orvalAxios = async <T = unknown>(
  config: AxiosRequestConfig
): Promise<T> => {
  const { data } = await api.request<T>(config);
  return data;
};
