import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, TextInput, TouchableOpacity, View } from 'react-native';

import { useAppointments } from '@/src/hooks/useAppointments';
import { checkInAppointmentRequest } from '@/src/services/appointmentService';
import { Appointment } from '@/src/types';

import { AppointmentCard } from '@/src/components/AppointmentCard';
import { ScannerModal } from '@/src/components/ScannerModal';
import { SuccessModal } from '@/src/components/SuccessModal';
import { createStyles } from './index.styles';

export default function AppointmentsScreen() {
    const theme = useColorScheme() ?? 'light';
    const activeColors = Colors[theme] || Colors.light;
    const styles = createStyles(activeColors);

    const {
        appointments,
        searchQuery,
        setSearchQuery,
        isLoading,
        isRefreshing,
        isLoadingMore,
        loadAppointments,
        onRefresh,
        handleLoadMore,
        removeAppointment
    } = useAppointments();

    const [permission, requestPermission] = useCameraPermissions();
    const [isScannerVisible, setIsScannerVisible] = useState(false);
    const [isProcessingCheckIn, setIsProcessingCheckIn] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        loadAppointments();
    }, [loadAppointments]);

    const handleCheckInIntent = async (appt: Appointment) => {
        if (!permission) return;

        if (!permission.granted) {
            const { granted } = await requestPermission();
            if (!granted) {
                Alert.alert("Permiso Denegado", "Se requiere acceso a la cámara para escanear el código QR.");
                return;
            }
        }

        setSelectedAppt(appt);
        setIsScannerVisible(true);
    };

    const handleQRScanned = async (data: string) => {
        if (!selectedAppt) return;
        setIsProcessingCheckIn(true);

        if (data === selectedAppt.code) {
            try {
                const result = await checkInAppointmentRequest(selectedAppt.id) as any;
                if (result.success) {
                    setIsScannerVisible(false);
                    setShowSuccessModal(true);

                    removeAppointment(selectedAppt.id);

                    setTimeout(() => {
                        setShowSuccessModal(false);
                        setSelectedAppt(null);
                    }, 2500);
                } else {
                    Alert.alert("Error", result.message || "No se pudo realizar el check-in.");
                }
            } catch (error) {
                console.error("Error en check-in:", error);
                Alert.alert("Error", "Ocurrió un problema de red al procesar el check-in.");
            }
        } else {
            Alert.alert("Código Inválido", "El código QR no coincide con esta cita.", [
                { text: "Aceptar" }
            ]);
        }

        setIsProcessingCheckIn(false);
    };

    const handleViewDetails = (appt: Appointment) => {
        router.push({ pathname: '/appointment/[id]', params: { id: appt.id } });
    };

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
                data={appointments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <AppointmentCard
                        item={item}
                        onViewDetails={handleViewDetails}
                        onCheckIn={handleCheckInIntent}
                    />
                )}
                contentContainerStyle={styles.listContainer}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => isLoadingMore ? <View style={styles.footerLoader}><ActivityIndicator color={activeColors.primary} /></View> : null}
                showsVerticalScrollIndicator={false}
            />

            <ScannerModal
                visible={isScannerVisible}
                isProcessing={isProcessingCheckIn}
                onScanned={handleQRScanned}
                onClose={() => setIsScannerVisible(false)}
            />

            <SuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />
        </View>
    );
}