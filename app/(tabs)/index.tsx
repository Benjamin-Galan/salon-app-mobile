import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getConfirmedAppointmentsRequest, checkInAppointmentRequest } from '@/src/services/appointmentService';
import { Appointment } from '@/src/types';
import { formatDate, formatTime } from '@/src/utils/formatDateTime';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions
} from 'react-native';
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export default function AppointmentsScreen() {
    const theme = useColorScheme() ?? 'light';
    const activeColors = Colors[theme] || Colors.light;

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Scanner States
    const [permission, requestPermission] = useCameraPermissions();
    const [isScannerVisible, setIsScannerVisible] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

    const loadAppointments = async () => {
        try {
            setIsLoading(true)
            const result = await getConfirmedAppointmentsRequest() as unknown as ApiResponse<Appointment[]>;

            // result is usually { success: true, data: [...] }
            if (result.success && result.data) {
                setAppointments(result.data);
            }
        } catch (error) {
            console.error("Error cargando citas:", error);
            // Alert.alert("Error", "No se pudieron cargar las citas."); 
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, []);

    const onRefresh = () => {
        setIsRefreshing(true);
        loadAppointments();
    };

    // Filter appointments based on search query (by user name)
    const filteredAppointments = appointments.filter((appt: any) => {
        if (!appt.user || !appt.user.name) return false;
        return appt.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleCheckIn = async (appt: Appointment) => {
        if (!permission) {
            // Camera permissions are still loading.
            return;
        }

        if (!permission.granted) {
            const { granted } = await requestPermission();
            if (!granted) {
                Alert.alert("Permiso Denegado", "Se requiere acceso a la cámara para escanear el código QR.");
                return;
            }
        }

        setSelectedAppt(appt);
        setIsScannerVisible(true);
        setScanned(false);
    };

    const onBarCodeScanned = async ({ data }: { data: string }) => {
        if (scanned || !selectedAppt) return;
        setScanned(true);

        // Validation logic
        if (data === selectedAppt.code) {
            try {
                const result = await checkInAppointmentRequest(selectedAppt.id) as ApiResponse<any>;
                if (result.success) {
                    Alert.alert("Éxito", "Check-in realizado correctamente.");
                    // Remove appointment from list
                    setAppointments(prev => prev.filter(a => a.id !== selectedAppt.id));
                    setIsScannerVisible(false);
                } else {
                    Alert.alert("Error", result.message || "No se pudo realizar el check-in.");
                    setScanned(false);
                }
            } catch (error) {
                console.error("Error en check-in:", error);
                Alert.alert("Error", "Ocurrió un problema de red al procesar el check-in.");
                setScanned(false);
            }
        } else {
            Alert.alert("Código Inválido", "El código QR no coincide con esta cita.", [
                { text: "Reintentar", onPress: () => setScanned(false) }
            ]);
        }
    };

    const handleViewDetails = (appt: Appointment) => {
        router.push({
            pathname: '/appointment/[id]',
            params: {
                id: appt.id
            }
        })
    };

    const renderAppointmentCard = ({ item }: { item: any }) => (
        <View style={[styles.card, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
            <View style={styles.cardHeader}>
                <View style={styles.clientInfo}>
                    <Ionicons name="person-circle-outline" size={40} color={activeColors.primary} />
                    <View style={styles.clientTextContainer}>
                        <Text style={[styles.clientName, { color: activeColors.text }]}>
                            {item.user ? item.user.name : 'Cliente Desconocido'}
                        </Text>
                        <Text style={[styles.dateTime, { color: activeColors.muted }]}>
                            <Ionicons name="calendar-outline" size={12} /> {formatDate(item.date)} • <Ionicons name="time-outline" size={12} /> {formatTime(item.time)}
                        </Text>
                    </View>
                </View>
                <Text style={[styles.priceTag, { color: activeColors.primary }]}>
                    C$ {item.total}
                </Text>
            </View>

            <View style={[styles.divider, { borderBottomColor: activeColors.border }]} />

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton, { borderColor: activeColors.primary }]}
                    onPress={() => handleViewDetails(item)}
                >
                    <Ionicons name="document-text-outline" size={18} color={activeColors.primary} />
                    <Text style={[styles.actionButtonText, { color: activeColors.primary }]}>Detalles</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton, { backgroundColor: activeColors.primary }]}
                    onPress={() => handleCheckIn(item)}
                >
                    <Ionicons name="scan-outline" size={18} color="#FFF" />
                    <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Check In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const styles = createStyles(activeColors);

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
                <Ionicons name="search" size={20} color={activeColors.icon} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: activeColors.text }]}
                    placeholder="Buscar cliente..."
                    placeholderTextColor={activeColors.muted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color={activeColors.muted} />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={filteredAppointments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderAppointmentCard}
                contentContainerStyle={styles.listContainer}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                showsVerticalScrollIndicator={false}
            />

            {/* QR Scanner Modal */}
            <Modal
                visible={isScannerVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setIsScannerVisible(false)}
            >
                <View style={styles.scannerContainer}>
                    <CameraView
                        style={StyleSheet.absoluteFillObject}
                        facing="back"
                        onBarcodeScanned={scanned ? undefined : onBarCodeScanned}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr"],
                        }}
                    />
                    
                    {/* Scanner Overlay */}
                    <View style={styles.overlay}>
                        <View style={styles.unfocusedContainer}></View>
                        <View style={styles.middleContainer}>
                            <View style={styles.unfocusedContainer}></View>
                            <View style={styles.focusedContainer}>
                                <View style={[styles.corner, styles.topLeft]} />
                                <View style={[styles.corner, styles.topRight]} />
                                <View style={[styles.corner, styles.bottomLeft]} />
                                <View style={[styles.corner, styles.bottomRight]} />
                            </View>
                            <View style={styles.unfocusedContainer}></View>
                        </View>
                        <View style={styles.unfocusedContainer}>
                            <Text style={styles.scannerText}>Centra el código QR para escanear</Text>
                            <TouchableOpacity 
                                style={[styles.closeScannerButton, { backgroundColor: activeColors.primary }]}
                                onPress={() => setIsScannerVisible(false)}
                            >
                                <Text style={styles.closeScannerButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: Spacing.md,
        fontSize: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: Spacing.md,
        paddingHorizontal: Spacing.md,
        height: 50,
        borderRadius: BorderRadius.round,
        borderWidth: 1,
    },
    searchIcon: {
        marginRight: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    listContainer: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    card: {
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginBottom: Spacing.md,
        padding: Spacing.md,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    clientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    clientTextContainer: {
        marginLeft: Spacing.sm,
    },
    clientName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateTime: {
        fontSize: 14,
        marginTop: 2,
    },
    priceTag: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        borderBottomWidth: 1,
        marginVertical: Spacing.md,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: BorderRadius.md,
    },
    secondaryButton: {
        borderWidth: 1,
        marginRight: Spacing.sm,
    },
    primaryButton: {
        marginLeft: Spacing.sm,
    },
    actionButtonText: {
        marginLeft: Spacing.xs,
        fontWeight: '600',
        fontSize: 15,
    },
    // Scanner Styles
    scannerContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    unfocusedContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleContainer: {
        flexDirection: 'row',
        height: 250,
    },
    focusedContainer: {
        width: 250,
        height: 250,
        borderWidth: 0,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#FFF',
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
    },
    scannerText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: Spacing.xl,
        textAlign: 'center',
    },
    closeScannerButton: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.round,
    },
    closeScannerButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
