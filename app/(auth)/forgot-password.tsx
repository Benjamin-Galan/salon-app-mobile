import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from "react-native";
import { forgotPasswordRequest } from "../../src/services/authService";
import { Colors, Spacing, BorderRadius } from "../../constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const theme = useColorScheme() ?? 'light';
    const activeColors = Colors[theme] || Colors.light;

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Por favor ingresa tu correo electrónico.");
            return;
        }

        setIsLoading(true);
        try {
            await forgotPasswordRequest(email);
            setEmailSent(true);
        } catch (error: any) {
            Alert.alert("Error", error?.message || "No se pudo enviar el enlace de recuperación.");
        } finally {
            setIsLoading(false);
        }
    };

    const styles = createStyles(activeColors);

    if (emailSent) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.headerContainer}>
                        <View style={styles.successIconContainer}>
                            <Ionicons name="mail-outline" size={80} color={activeColors.primary} />
                        </View>
                        <Text style={styles.title}>¡Correo enviado!</Text>
                        <Text style={styles.description}>
                            Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.buttonText}>VOLVER AL LOGIN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.resendContainer}
                        onPress={() => {
                            setEmailSent(false);
                            setEmail("");
                        }}
                    >
                        <Text style={styles.resendText}>¿No recibiste el correo? Intentar de nuevo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={activeColors.text} />
                </TouchableOpacity>

                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <Ionicons name="lock-closed-outline" size={80} color={activeColors.primary} style={styles.logoIcon} />
                    <Text style={styles.title}>Recuperar Contraseña</Text>
                    <Text style={styles.description}>
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                    </Text>
                </View>

                {/* Form Section */}
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color={activeColors.icon} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
                            placeholderTextColor={activeColors.muted}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleForgotPassword}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>ENVIAR ENLACE</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: Spacing.xl,
        width: 44,
        height: 44,
        borderRadius: BorderRadius.round,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    successIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    logoIcon: {
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: Spacing.sm,
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 15,
        color: colors.muted,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: Spacing.md,
    },
    formContainer: {
        marginBottom: Spacing.xl,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.md,
        height: 56,
    },
    inputIcon: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        color: colors.text,
        fontSize: 16,
        height: '100%',
    },
    button: {
        backgroundColor: colors.primary,
        height: 56,
        borderRadius: BorderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    resendContainer: {
        alignItems: 'center',
        marginTop: Spacing.xl,
    },
    resendText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});
