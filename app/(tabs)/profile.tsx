import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { logoutRequest } from '@/src/services/authService';
import { useAuthStore } from '@/src/store/authStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const theme = useColorScheme() ?? 'light';
    const activeColors = Colors[theme] || Colors.light;

    const user = useAuthStore((state) => state.user);
    const logoutAction = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro que deseas cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sí, salir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logoutRequest();
                        } catch (e) {
                            console.log("Logout backend error, proceeding anyway", e);
                        } finally {
                            logoutAction();
                            router.replace("/(auth)/login");
                        }
                    }
                }
            ]
        );
    };

    const styles = createStyles(activeColors);

    return (
        <View style={styles.container}>
            <View style={[styles.profileCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
                <Ionicons name="person-circle" size={100} color={activeColors.primary} />
                <Text style={[styles.name, { color: activeColors.text }]}>
                    {user?.name || "Empleado Salon"}
                </Text>
                <Text style={[styles.email, { color: activeColors.muted }]}>
                    {user?.email || "correo@ejemplo.com"}
                </Text>
                <View style={[styles.roleBadge, { backgroundColor: activeColors.primary + '20' }]}>
                    <Text style={[styles.roleText, { color: activeColors.primary }]}>
                        {user?.role?.toUpperCase() || "STAFF"}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Ionicons name="log-out-outline" size={20} color="#FFF" />
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: Spacing.xl,
        justifyContent: 'center',
    },
    profileCard: {
        alignItems: 'center',
        padding: Spacing.xl,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginBottom: Spacing.xxl,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: Spacing.md,
    },
    email: {
        fontSize: 16,
        marginTop: Spacing.xs,
        marginBottom: Spacing.sm,
    },
    roleBadge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.round,
        marginTop: Spacing.xs,
    },
    roleText: {
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 1,
    },
    logoutButton: {
        backgroundColor: '#ef4444', // Red-500 for destructive action
        flexDirection: 'row',
        height: 56,
        borderRadius: BorderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: Spacing.sm,
    },
});
