import { loginRequest, registerRequest } from "../services/authService"
import { useAuthStore } from "../store/authStore"

export const useAuth = () => {
    const loginStore = useAuthStore((state) => state.login)
    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)

    console.log("user", user)
    console.log("token", token)

    const login = async (email, password) => {
        const response = await loginRequest(email, password);

        loginStore(response.user, response.token);
    }

    const register = async (data) => {
        const response = await registerRequest(data)

        loginStore(response.user, response.token)
    }

    return {
        login,
        register
    }
}