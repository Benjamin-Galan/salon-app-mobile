import { Link, router } from "expo-router";
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
import { useAuth } from "../../src/hooks/useAuth";
import { Colors, Spacing, BorderRadius } from "../../constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    
    // Obtener tema actual (claro/oscuro)
    const theme = useColorScheme() ?? 'light';
    const activeColors = Colors[theme] || Colors.light;

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor ingresa tu correo y contraseña.");
            return;
        }

        setIsLoading(true);
        try {
            await login(email, password);
            router.replace("/");
        } catch (error: any) {
            console.log("error", error);
            Alert.alert("Error de Inicio de Sesión", error?.message || "Credenciales incorrectas");
        } finally {
            setIsLoading(false);
        }
    };

    const styles = createStyles(activeColors);

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <Ionicons name="cut-outline" size={80} color={activeColors.primary} style={styles.logoIcon} />
                    <Text style={styles.title}>Bienvenido</Text>
                    <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
                </View>

                {/* Form Section */}
                <View style={styles.formContainer}>
                    {/* Email Input */}
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

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={activeColors.icon} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            placeholderTextColor={activeColors.muted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <Ionicons 
                                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                                size={20} 
                                color={activeColors.icon} 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity style={styles.forgotPasswordContainer}>
                        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity 
                        style={[styles.button, isLoading && styles.buttonDisabled]} 
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer Section */}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
                    <Link href="/(auth)/register" asChild>
                        <TouchableOpacity>
                            <Text style={styles.registerText}>Regístrate</Text>
                        </TouchableOpacity>
                    </Link>
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
    headerContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    logoIcon: {
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: Spacing.xs,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: colors.muted,
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
        marginBottom: Spacing.md,
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
    eyeIcon: {
        padding: Spacing.sm,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: Spacing.xl,
    },
    forgotPasswordText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
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
        color: '#FFFFFF', // Blanco duro para contrastar con el color oro/rosado
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    footerText: {
        color: colors.text,
        fontSize: 15,
    },
    registerText: {
        color: colors.primary,
        fontSize: 15,
        fontWeight: 'bold',
    },
});