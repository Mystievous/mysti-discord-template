import axios, { AxiosError } from "axios";
import { convertAPIDates } from "./utils/date-utils";

const { API_URL, API_KEY } = process.env;

if (!API_URL) {
  throw new Error("API URL is not set in environment variables.");
}

if (!API_KEY) {
  throw new Error("API key is not set in environment variables.");
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "api-key": API_KEY,
  },
});

api.interceptors.response.use(
  function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger

    // Convert date strings to Date objects
    // This will apply to any object coming into axios, converting matching timestamp strings to Dates.
    response.data = convertAPIDates(response.data);

    return response;
  },
  async function onRejected(error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger

    // if (error.response?.status === 401) {
    //   // Handle Unauthorized errors
    // }

    return Promise.reject(error);
  }
);

export { api };
