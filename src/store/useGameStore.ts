import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { BEST_SCORE_STORAGE_KEY, MAX_VALUE, MIN_VALUE } from '../constants/game';
import { gameUtils } from '../utils/gameUtils';

interface GameState {
    // Persisted
    bestScore: number | null;

    // Transient
    secretNumber: number;
    currentGuess: number;
    guessCount: number;
    lastHint: string | null;
    isGameOver: boolean;

    // Actions
    startNewGame: () => void;
    incrementGuess: () => void;
    decrementGuess: () => void;
    submitGuess: () => void;
    resetBestScore: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            bestScore: null,
            secretNumber: gameUtils.generateSecretNumber(),
            currentGuess: MIN_VALUE,
            guessCount: 0,
            lastHint: null,
            isGameOver: false,

            startNewGame: () => {
                set({
                    secretNumber: gameUtils.generateSecretNumber(),
                    currentGuess: MIN_VALUE,
                    guessCount: 0,
                    lastHint: null,
                    isGameOver: false,
                });
            },

            incrementGuess: () => {
                const { currentGuess, isGameOver } = get();
                if (isGameOver || currentGuess >= MAX_VALUE) return;
                set({ currentGuess: currentGuess + 1 });
            },

            decrementGuess: () => {
                const { currentGuess, isGameOver } = get();
                if (isGameOver || currentGuess <= MIN_VALUE) return;
                set({ currentGuess: currentGuess - 1 });
            },

            submitGuess: () => {
                const { currentGuess, secretNumber, guessCount, bestScore, isGameOver } = get();
                if (isGameOver) return;

                const newGuessCount = guessCount + 1;

                if (currentGuess === secretNumber) {
                    // Game over - handle best score logic
                    let newBestScore = bestScore;
                    if (bestScore === null || newGuessCount < bestScore) {
                        newBestScore = newGuessCount;
                    }

                    set({
                        guessCount: newGuessCount,
                        lastHint: 'Correct!',
                        isGameOver: true,
                        bestScore: newBestScore,
                    });
                } else if (currentGuess < secretNumber) {
                    set({
                        guessCount: newGuessCount,
                        lastHint: 'Higher!',
                    });
                } else {
                    set({
                        guessCount: newGuessCount,
                        lastHint: 'Lower!',
                    });
                }
            },

            resetBestScore: () => set({ bestScore: null }),
        }),
        {
            name: BEST_SCORE_STORAGE_KEY,
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ bestScore: state.bestScore }), // Only persist bestScore
        }
    )
);
