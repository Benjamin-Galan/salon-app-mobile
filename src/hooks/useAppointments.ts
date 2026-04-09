import { useState, useCallback } from 'react';
import { getConfirmedAppointmentsRequest } from '@/src/services/appointmentService';
import { Appointment } from '@/src/types';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    pagination?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export function useAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Pagination States
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadAppointments = useCallback(async (pageToLoad = 1, shouldRefresh = false) => {
        try {
            if (pageToLoad === 1 && !shouldRefresh) {
                setIsLoading(true);
            } else if (pageToLoad > 1) {
                setIsLoadingMore(true);
            }

            const result = await getConfirmedAppointmentsRequest(pageToLoad) as unknown as ApiResponse<Appointment[]>;

            if (result.success && result.data) {
                if (pageToLoad === 1) {
                    setAppointments(result.data);
                } else {
                    setAppointments(prev => {
                        const existingIds = new Set(prev.map(a => a.id));
                        const newItems = (result.data || []).filter(a => !existingIds.has(a.id));
                        return [...prev, ...newItems];
                    });
                }

                if (result.pagination) {
                    setHasMore(result.pagination.current_page < result.pagination.last_page);
                    setPage(result.pagination.current_page);
                } else {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Error cargando citas:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
            setIsLoadingMore(false);
        }
    }, []);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        setPage(1);
        setHasMore(true);
        loadAppointments(1, true);
    }, [loadAppointments]);

    const handleLoadMore = useCallback(() => {
        if (!isLoadingMore && hasMore && !isLoading) {
            loadAppointments(page + 1);
        }
    }, [isLoadingMore, hasMore, isLoading, page, loadAppointments]);

    const removeAppointment = useCallback((id: number) => {
        setAppointments(prev => prev.filter(a => a.id !== id));
    }, []);

    const filteredAppointments = appointments.filter((appt: any) => {
        if (!appt.user || !appt.user.name) return false;
        return appt.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return {
        appointments: filteredAppointments,
        searchQuery,
        setSearchQuery,
        isLoading,
        isRefreshing,
        isLoadingMore,
        loadAppointments,
        onRefresh,
        handleLoadMore,
        removeAppointment
    };
}
