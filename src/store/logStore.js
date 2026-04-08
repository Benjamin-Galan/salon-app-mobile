import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useLogStore = create()(
    persist(
        (set, get) => ({
            logs: [],
            addLog: (type, message, data = null) => {
                const newLog = {
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString(),
                    type, // 'info', 'error', 'debug'
                    message,
                    data: data ? JSON.stringify(data, null, 2) : null,
                };

                set((state) => ({
                    logs: [newLog, ...state.logs].slice(0, 50), // Keep last 50 logs
                }));
            },
            clearLogs: () => set({ logs: [] }),
        }),
        {
            name: "salon-app-logs",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
