import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { authService } from '../services/authService';

interface AuthState {
    isAuthenticated: boolean;
    currentUser: string | null;
    error: string | null;

    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    checkExistingSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            currentUser: null,
            error: null,

            checkExistingSession: async () => {
                const hasUser = await authService.hasExistingUser();
                // Intentionally not auto-logging in via check session for this flow per requirements.
                // Spec assumes explicit login.
            },

            login: async (username, password) => {
                set({ error: null });
                if (!username || !password) {
                    set({ error: 'Username and password are required' });
                    return;
                }

                const isValid = await authService.validateCredentials(username, password);
                if (!isValid) {
                    set({ error: 'Invalid username or password' });
                    return;
                }

                set({ isAuthenticated: true, currentUser: username, error: null });
            },

            register: async (username, password) => {
                set({ error: null });
                if (!username || !password) {
                    set({ error: 'Username and password cannot be empty' });
                    return;
                }

                const hasUser = await authService.hasExistingUser();

                // Check if registering the *same* user or a different one
                if (hasUser) {
                    const storedUsername = await authService.getStoredUsername();
                    if (storedUsername && storedUsername !== username) {
                        set({ error: 'An account already exists on this device.' });
                        return;
                    }
                }

                await authService.saveCredentials(username, password);
                set({ error: null });
                // Success - user is registered and will manually proceed to login or app will redirect
            },

            logout: () => {
                set({ isAuthenticated: false, currentUser: null, error: null });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) => ({ isAuthenticated: state.isAuthenticated, currentUser: state.currentUser }),
        }
    )
);
