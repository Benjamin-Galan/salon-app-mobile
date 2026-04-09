import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onClose }) => {
    const theme = useColorScheme() ?? 'light';
    const activeColors = Colors[theme] || Colors.light;
    const styles = createStyles(activeColors);

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.successModalBackground}>
                <View style={[styles.successModalContent, { backgroundColor: activeColors.card }]}>
                    <View style={styles.successIconContainer}>
                        <Ionicons name="checkmark-circle" size={80} color="#10B981" />
                    </View>
                    <Text style={[styles.successModalTitle, { color: activeColors.text }]}>¡Check-in Exitoso!</Text>
                    <Text style={[styles.successModalSubtitle, { color: activeColors.muted }]}>
                        El cliente ha sido registrado y notificado correctamente.
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

const createStyles = (colors: any) => StyleSheet.create({
    successModalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successModalContent: {
        width: '80%',
        padding: Spacing.xl,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    successIconContainer: {
        marginBottom: Spacing.md,
    },
    successModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    successModalSubtitle: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
});
