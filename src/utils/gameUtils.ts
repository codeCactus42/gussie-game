import { MAX_VALUE, MIN_VALUE } from '../constants/game';

export const gameUtils = {
    generateSecretNumber: (): number => {
        return Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE;
    },
};
