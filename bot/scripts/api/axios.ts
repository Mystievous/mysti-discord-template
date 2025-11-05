import axios, { AxiosError } from "axios";
import { convertAPIDates } from "./utils/date-utils";

const { API_URL } = process.env;

if (!API_URL) {
  throw new Error("API config is invalid.");
}

const api = axios.create({
  baseURL: API_URL,
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
