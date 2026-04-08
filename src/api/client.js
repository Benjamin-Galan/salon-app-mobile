import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useLogStore } from "../store/logStore";

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
    (error) => {
        useLogStore.getState().addLog('error', 'Axios Request Error', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const logData = {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        };

        useLogStore.getState().addLog('error', 'API Error', logData);

        return Promise.reject(error);
    }
);
