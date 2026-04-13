import { BorderRadius, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) => StyleSheet.create({
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
    footerLoader: {
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
});
