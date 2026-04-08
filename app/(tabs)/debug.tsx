import { useLogStore } from "@/src/store/logStore";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Clipboard,
    Alert
} from "react-native";

export default function DebugScreen() {
    const theme = useColorScheme() ?? "light";
    const activeColors = Colors[theme] || Colors.light;
    const { logs, clearLogs } = useLogStore();

    const copyToClipboard = (log: any) => {
        const fullLog = `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}\n${log.data || ""}`;
        Clipboard.setString(fullLog);
        Alert.alert("Copiado", "Log copiado al portapapeles");
    };

    const confirmClear = () => {
        Alert.alert(
            "Limpiar Logs",
            "¿Estás seguro de que quieres borrar todos los logs?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Borrar", style: "destructive", onPress: clearLogs }
            ]
        );
    };

    const renderLogItem = ({ item }: { item: any }) => {
        const isError = item.type === 'error';
        const color = isError ? '#FF5252' : '#4CAF50';

        return (
            <TouchableOpacity 
                style={[styles.logItem, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}
                onLongPress={() => copyToClipboard(item)}
            >
                <View style={styles.logHeader}>
                    <View style={[styles.typeBadge, { backgroundColor: color }]}>
                        <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
                    </View>
                    <Text style={[styles.timestamp, { color: activeColors.muted }]}>
                        {new Date(item.timestamp).toLocaleTimeString()}
                    </Text>
                </View>
                
                <Text style={[styles.message, { color: activeColors.text }]}>{item.message}</Text>
                
                {item.data && (
                    <View style={[styles.dataContainer, { backgroundColor: activeColors.background }]}>
                        <Text style={[styles.dataText, { color: activeColors.muted }]}>{item.data}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const styles = createStyles(activeColors);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: activeColors.text }]}>Consola de Debug</Text>
                <TouchableOpacity onPress={confirmClear} style={styles.clearButton}>
                    <Ionicons name="trash-outline" size={24} color="#FF5252" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={logs}
                keyExtractor={(item) => item.id}
                renderItem={renderLogItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={60} color={activeColors.muted} />
                        <Text style={[styles.emptyText, { color: activeColors.muted }]}>No hay logs registrados</Text>
                    </View>
                }
            />

            <View style={styles.footer}>
                <Text style={[styles.footerText, { color: activeColors.muted }]}> Mantén presionado un log para copiarlo </Text>
            </View>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        paddingTop: 60,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    clearButton: {
        padding: Spacing.sm,
    },
    list: {
        padding: Spacing.md,
    },
    logItem: {
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    typeBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    typeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    timestamp: {
        fontSize: 12,
    },
    message: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: Spacing.xs,
    },
    dataContainer: {
        marginTop: Spacing.sm,
        padding: Spacing.sm,
        borderRadius: 4,
    },
    dataText: {
        fontSize: 12,
        fontFamily: 'monospace',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: Spacing.md,
        fontSize: 16,
    },
    footer: {
        padding: Spacing.md,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    footerText: {
        fontSize: 12,
    },
});
