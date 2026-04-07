import { api } from "../api/client";

export const loginRequest = async (email, password) => {
    try {
        const response = await api.post('/auth/login', {
            email,
            password,
            device_name: 'mobile_app'
        });

        return response.data
    } catch (error) {
        if (error.response) {
            throw error.response.data
        }

        throw new Error("Error al iniciar sesión")
    }
}

export const registerRequest = async (data) => {
    try {
        const response = await api.post('/auth/register', data);

        return response.data
    } catch (error) {
        if (error.response) {
            throw error.response.data
        }

        throw new Error("Error al registrarse")
    }
}

export const meRequest = async () => {
    try {
        const response = await api.get("/auth/me");

        return response.data
    } catch (error) {
        if (error.response) {
            throw error.response.data
        }

        throw new Error("Error al obtener el usuario")
    }
}

export const logoutRequest = async () => {
    try {
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        }
        throw new Error("Error al cerrar sesión");
    }
}
