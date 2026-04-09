import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            _hasHydrated: false, // <--- Nueva bandera

            setHasHydrated: (state) => set({ _hasHydrated: state }),

            login: (user, token) => set({
                user,
                token,
                isAuthenticated: true
            }),

            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false
            }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
            // Se llama cuando zustand ya ha recuperado los datos de AsyncStorage
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
)