import { useAuthStore } from "@/src/store/authStore";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
    const token = useAuthStore((state) => state.token);
    const _hasHydrated = useAuthStore((state) => state._hasHydrated);

    // Esperar a que zustand lea de AsyncStorage
    if (!_hasHydrated) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (token) {
        return <Redirect href="/(tabs)" />;
    }
    return <Redirect href="/(auth)/login" />;
}