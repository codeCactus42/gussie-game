import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { USER_CREDENTIALS_STORAGE_KEY } from '../constants/game';

interface UserCredentials {
    username: string;
    passwordHash: string;
}

const hashPassword = async (password: string): Promise<string> => {
    return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
    );
};

export const authService = {
    hasExistingUser: async (): Promise<boolean> => {
        try {
            const data = await SecureStore.getItemAsync(USER_CREDENTIALS_STORAGE_KEY);
            return data !== null;
        } catch {
            return false;
        }
    },

    getStoredUsername: async (): Promise<string | null> => {
        try {
            const data = await SecureStore.getItemAsync(USER_CREDENTIALS_STORAGE_KEY);
            if (data) {
                const parsed: UserCredentials = JSON.parse(data);
                return parsed.username;
            }
            return null;
        } catch {
            return null;
        }
    },

    saveCredentials: async (username: string, password: string): Promise<void> => {
        const passwordHash = await hashPassword(password);
        const credentials: UserCredentials = { username, passwordHash };
        await SecureStore.setItemAsync(
            USER_CREDENTIALS_STORAGE_KEY,
            JSON.stringify(credentials)
        );
    },

    validateCredentials: async (username: string, password: string): Promise<boolean> => {
        try {
            const data = await SecureStore.getItemAsync(USER_CREDENTIALS_STORAGE_KEY);
            if (!data) return false;

            const parsed: UserCredentials = JSON.parse(data);
            if (parsed.username !== username) return false;

            const passwordHash = await hashPassword(password);
            return parsed.passwordHash === passwordHash;
        } catch {
            return false;
        }
    },

    clearCredentials: async (): Promise<void> => {
        await SecureStore.deleteItemAsync(USER_CREDENTIALS_STORAGE_KEY);
    },
};
