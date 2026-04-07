import { useAuthStore } from "@/src/store/authStore";
import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    router.replace("/")
  }

  return (
    <View>
      <Text>Home</Text>
      <Button title="Logout" onPress={() => handleLogout()} />
    </View>
  );
}