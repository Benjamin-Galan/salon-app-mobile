import { loginRequest } from "../services/authService"
import { useAuthStore } from "../store/authStore"

export const useAuth = () => {
    const loginStore = useAuthStore((state) => state.login)
    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)

    const login = async (email, password) => {
        const response = await loginRequest(email, password);

        loginStore(response.user, response.token);
    }

    return {
        login,
        user,
        token,
    }
}