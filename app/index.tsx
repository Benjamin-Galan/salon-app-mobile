import { useAuthStore } from "@/src/store/authStore";
import { Redirect } from "expo-router";

export default function Index() {
    const token = useAuthStore((state) => state.token)

    if (token) {
        return <Redirect href="/(tabs)" />;
    }
    return <Redirect href="/(auth)/login" />;
}