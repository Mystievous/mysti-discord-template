import axios from "axios";

const { API_URL } = process.env;

if (!API_URL) {
    throw new Error("API config is invalid.");
}

const api = axios.create({
    baseURL: API_URL
})

export { api };