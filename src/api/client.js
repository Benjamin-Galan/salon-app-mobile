import axios from "axios";
import { useAuthStore } from "../store/authStore";

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://72.61.5.146/api";

export const api = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);
