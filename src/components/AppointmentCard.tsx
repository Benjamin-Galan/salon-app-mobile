import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { Appointment } from '@/src/types';
import { formatDate, formatTime } from '@/src/utils/formatDateTime';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface AppointmentCardProps {
    item: Appointment | any; // Type accurately mapped to what backend provides
    onViewDetails: (appt: Appointment) => void;
    onCheckIn: (appt: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ item, onViewDetails, onCheckIn }) => {
    const theme = useColorScheme() ?? 'light';
    const activeColors = Colors[theme] || Colors.light;
    const styles = createStyles(activeColors);

    return (
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
                    onPress={() => onViewDetails(item)}
                >
                    <Ionicons name="document-text-outline" size={18} color={activeColors.primary} />
                    <Text style={[styles.actionButtonText, { color: activeColors.primary }]}>Detalles</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton, { backgroundColor: activeColors.primary }]}
                    onPress={() => onCheckIn(item)}
                >
                    <Ionicons name="scan-outline" size={18} color="#FFF" />
                    <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Check In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = (colors: any) => StyleSheet.create({
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
});
