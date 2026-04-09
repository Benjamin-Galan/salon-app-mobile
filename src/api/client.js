import axios from "axios";
import { Alert } from "react-native";
import { useAuthStore } from "../store/authStore";
import { useLogStore } from "../store/logStore";

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://72.61.5.146/api";
//const apiUrl = "http://192.168.1.2:8000/api";

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

        // Si es 401 (No autenticado) o 403 (No tiene permisos/rol adecuado)
        if (error.response?.status === 401 || error.response?.status === 403) {

            // Si es 403, avisar específicamente
            if (error.response?.status === 403) {
                Alert.alert("Acceso Denegado", "Tu perfil no tiene permisos de empleado o administrador para usar esta aplicación.");
            }

            // Limpiamos la sesión e inmediatamente Expo Router nos echará al login
            useAuthStore.getState().logout();
        }

        return Promise.reject(error);
    }
);
