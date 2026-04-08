import { api } from "../api/client";

/**
 * Obtiene las citas confirmadas con paginación
 * @param {number} page - El número de página a solicitar
 * @returns {Promise<Object>} Respuesta con datos y metadatos de paginación
 */
export const getConfirmedAppointmentsRequest = async (page = 1) => {
    try {
        const response = await api.get(`/appointments/confirmed?page=${page}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        }
        throw new Error("Error al obtener las citas confirmadas");
    }
}

/**
 * Realiza el Check-In a una cita específica por su ID
 * @param {number} id - El ID de la cita
 * @returns {Promise<Object>} Resultado del check in
 */
export const checkInAppointmentRequest = async (id) => {
    try {
        const response = await api.post(`/appointments/${id}/check-in`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        }
        throw new Error("Error al realizar el check-in");
    }
}

export const getDetailsAppointmentById = async (id) => {
    try {
        const response = await api.get(`/appointments/${id}/details`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        }
        throw new Error("Error al obtener los detalles de la cita");
    }
}
