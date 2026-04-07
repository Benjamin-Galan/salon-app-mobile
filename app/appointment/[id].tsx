import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getDetailsAppointmentById } from "@/src/services/appointmentService";
import { formatDate, formatTime } from "@/src/utils/formatDateTime";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

export default function AppointmentDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [appointment, setAppointment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const theme = useColorScheme() ?? "light";
    const activeColors = Colors[theme] || Colors.light;

    useEffect(() => {
        const loadAppointment = async () => {
            try {
                const result = await getDetailsAppointmentById(id);
                if (result.success) {
                    setAppointment(result.data);
                }
            } catch (error) {
                console.error("Error cargando cita:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadAppointment();
    }, [id]);

    const styles = createStyles(activeColors);

    if (isLoading) {
        return (
            <View style={[styles.centered, { backgroundColor: activeColors.background }]}>
                <Stack.Screen options={{ title: 'Detalles de Cita', headerBackTitle: 'Atrás' }} />
                <ActivityIndicator size="large" color={activeColors.primary} />
            </View>
        );
    }

    if (!appointment) {
        return (
            <View style={[styles.centered, { backgroundColor: activeColors.background }]}>
                <Stack.Screen options={{ title: 'Error', headerBackTitle: 'Atrás' }} />
                <Ionicons name="alert-circle-outline" size={60} color={activeColors.primary} />
                <Text style={styles.errorText}>No se pudo cargar la cita.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Stack.Screen options={{ title: 'Detalles', headerBackTitle: 'Atrás' }} />

            {/* Header info */}
            <View style={[styles.headerCard, { backgroundColor: activeColors.card }]}>
                <View style={styles.statusRow}>
                    <View style={[styles.statusBadge, { backgroundColor: activeColors.primary + '20' }]}>
                        <Text style={[styles.statusText, { color: activeColors.primary }]}>{appointment.status}</Text>
                    </View>
                    <Text style={[styles.codeText, { color: activeColors.muted }]}>#{appointment.id}</Text>
                </View>

                <Text style={[styles.priceText, { color: activeColors.text }]}>C$ {appointment.total}</Text>

                <View style={styles.timeInfoContainer}>
                    <View style={styles.timeRow}>
                        <Ionicons name="calendar-outline" size={18} color={activeColors.muted} />
                        <Text style={[styles.timeText, { color: activeColors.text }]}>{formatDate(appointment.date)}</Text>
                    </View>
                    <View style={styles.timeRow}>
                        <Ionicons name="time-outline" size={18} color={activeColors.muted} />
                        <Text style={[styles.timeText, { color: activeColors.text }]}>
                            {formatTime(appointment.time)} • {appointment.duration} min
                        </Text>
                    </View>
                </View>
            </View>

            {/* Empleado Asignado */}
            {appointment.employee && (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Profesional Asignado</Text>
                    <View style={[styles.employeeCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
                        <Ionicons name="person-circle-outline" size={48} color={activeColors.primary} />
                        <View style={styles.employeeInfo}>
                            <Text style={[styles.employeeName, { color: activeColors.text }]}>{appointment.employee.name}</Text>
                            <Text style={[styles.employeeRole, { color: activeColors.muted }]}>{appointment.employee.position || 'Especialista'}</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Servicios/Paquetes */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Servicios Adquiridos</Text>
                <View style={[styles.itemsCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
                    {appointment.items?.map((itemObj: any, index: number) => {
                        const itemData = itemObj.item || {};
                        const isLast = index === appointment.items.length - 1;
                        const hasServices = itemData.services && itemData.services.length > 0;
                        const isCombo = itemObj.item_type === 'package' || itemObj.item_type === 'promotion';

                        return (
                            <View key={itemObj.id || index}>
                                <View style={styles.itemRow}>
                                    <View style={styles.itemTextContainer}>
                                        <Text style={[styles.itemName, { color: activeColors.text }]}>
                                            {itemObj.quantity > 1 ? `${itemObj.quantity}x ` : ''}
                                            {itemData.name || 'Desconocido'}
                                            {isCombo ? ` (${itemObj.item_type === 'package' ? 'Paquete' : 'Promoción'})` : ''}
                                        </Text>
                                        <Text style={[styles.itemDuration, { color: activeColors.muted }]}>
                                            {itemObj.duration_min || itemData.duration || 0} min
                                        </Text>
                                    </View>
                                    <Text style={[styles.itemPrice, { color: activeColors.text }]}>
                                        C$ {itemObj.unit_price || itemObj.price || itemData.price || 0}
                                    </Text>
                                </View>

                                {/* Render nested services for packages/promotions */}
                                {hasServices && (
                                    <View style={styles.subItemsContainer}>
                                        {itemData.services.map((subService: any, subIndex: number) => (
                                            <View key={subService.id || subIndex} style={styles.subItemRow}>
                                                <Ionicons name="return-down-forward-outline" size={14} color={activeColors.muted} style={styles.subItemIcon} />
                                                <Text style={[styles.subItemName, { color: activeColors.muted }]}>
                                                    {subService.name}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {!isLast && <View style={[styles.divider, { borderBottomColor: activeColors.border }]} />}
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Resumen Financiero */}
            <View style={[styles.summarySection, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: activeColors.muted }]}>Subtotal</Text>
                    <Text style={[styles.summaryValue, { color: activeColors.text }]}>C$ {appointment.subtotal}</Text>
                </View>
                {Number(appointment.discount) > 0 && (
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: activeColors.muted }]}>Descuento</Text>
                        <Text style={[styles.summaryValue, { color: '#ef4444' }]}>- C$ {appointment.discount}</Text>
                    </View>
                )}
                <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: activeColors.border }]}>
                    <Text style={[styles.totalLabel, { color: activeColors.text }]}>Total</Text>
                    <Text style={[styles.totalValue, { color: activeColors.primary }]}>C$ {appointment.total}</Text>
                </View>
            </View>

        </ScrollView>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        marginTop: Spacing.md,
        fontSize: 16,
        color: colors.text,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerCard: {
        padding: Spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    statusBadge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.round,
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    codeText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    priceText: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: Spacing.lg,
    },
    timeInfoContainer: {
        backgroundColor: colors.background,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    timeText: {
        fontSize: 16,
        marginLeft: Spacing.sm,
        fontWeight: '500',
    },
    section: {
        marginTop: Spacing.xl,
        paddingHorizontal: Spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.xs,
    },
    employeeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
    },
    employeeInfo: {
        marginLeft: Spacing.md,
    },
    employeeName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    employeeRole: {
        fontSize: 14,
        marginTop: 2,
    },
    itemsCard: {
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
    },
    itemTextContainer: {
        flex: 1,
        marginRight: Spacing.md,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemDuration: {
        fontSize: 14,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    subItemsContainer: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.md,
        marginTop: -Spacing.xs,
    },
    subItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        paddingLeft: Spacing.xs,
    },
    subItemIcon: {
        marginRight: Spacing.xs,
    },
    subItemName: {
        fontSize: 14,
        flex: 1,
    },
    divider: {
        height: 1,
        borderBottomWidth: 1,
    },
    summarySection: {
        marginVertical: Spacing.xl,
        marginHorizontal: Spacing.md,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.xs,
    },
    summaryLabel: {
        fontSize: 15,
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '500',
    },
    totalRow: {
        marginTop: Spacing.sm,
        paddingTop: Spacing.sm,
        borderTopWidth: 1,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});