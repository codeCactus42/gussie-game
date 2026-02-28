import { useRouter } from 'expo-router';
import { Button, PressableFeedback } from 'heroui-native';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { BounceIn, FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { RollingCounter } from '../../components/rolling-counter';
import { MAX_VALUE, MIN_VALUE } from '../../src/constants/game';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useGameStore } from '../../src/store/useGameStore';

export default function GameScreen() {
    const {
        currentGuess,
        incrementGuess,
        decrementGuess,
        submitGuess,
        lastHint,
        guessCount,
        isGameOver,
        bestScore
    } = useGameStore();

    const { logout, currentUser } = useAuthStore();
    const router = useRouter();

    // Navigate to yay screen when game is over
    useEffect(() => {
        if (isGameOver && guessCount > 0) {
            const timer = setTimeout(() => {
                router.push('/yay' as any);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isGameOver, guessCount, router]);

    const lottieRef = useRef<LottieView>(null);
    const [showHint, setShowHint] = useState(false);

    const incrementTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const decrementTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        return () => {
            if (incrementTimerRef.current) clearInterval(incrementTimerRef.current);
            if (decrementTimerRef.current) clearInterval(decrementTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (guessCount === 0) {
            // New game: just the cat
            // Animation runs at 24fps, 47% of 192 frames is roughly frame 90
            lottieRef.current?.play(0, 90);
            setShowHint(false);
        } else {
            // Guessed: play the bubble popping animation
            lottieRef.current?.play(90, 192);
            setShowHint(true);

            // Hide hint starting from 7.92s into the 8.0s animation
            // Which is (190 - 90)/24 = 4.16 seconds of playback
            const timer = setTimeout(() => {
                setShowHint(false);
            }, 4160);
            return () => clearTimeout(timer);
        }
    }, [guessCount, isGameOver]);

    const handleIncrement = () => {
        if (useGameStore.getState().currentGuess >= MAX_VALUE || useGameStore.getState().isGameOver) return;
        incrementGuess();
    };

    const handleDecrement = () => {
        if (useGameStore.getState().currentGuess <= MIN_VALUE || useGameStore.getState().isGameOver) return;
        decrementGuess();
    };

    const handleIncrementIn = () => {
        handleIncrement();
        incrementTimerRef.current = setInterval(() => {
            if (useGameStore.getState().currentGuess >= MAX_VALUE || useGameStore.getState().isGameOver) {
                if (incrementTimerRef.current) clearInterval(incrementTimerRef.current);
                return;
            }
            handleIncrement();
        }, 150);
    };

    const handleIncrementOut = () => {
        if (incrementTimerRef.current) {
            clearInterval(incrementTimerRef.current);
            incrementTimerRef.current = null;
        }
    };

    const handleDecrementIn = () => {
        handleDecrement();
        decrementTimerRef.current = setInterval(() => {
            if (useGameStore.getState().currentGuess <= MIN_VALUE || useGameStore.getState().isGameOver) {
                if (decrementTimerRef.current) clearInterval(decrementTimerRef.current);
                return;
            }
            handleDecrement();
        }, 150);
    };

    const handleDecrementOut = () => {
        if (decrementTimerRef.current) {
            clearInterval(decrementTimerRef.current);
            decrementTimerRef.current = null;
        }
    };

    const handleSubmit = () => {
        submitGuess();
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <Animated.View entering={FadeInDown.duration(400).delay(100)} className="flex-row justify-between items-center bg-black pt-16 p-6 shadow-sm rounded-b-[40px]">
                <View>
                    <Text className="text-zinc-400 font-bold uppercase tracking-wider text-xs">Player: {currentUser}</Text>
                    <Text className="text-white font-extrabold text-lg mt-0.5">
                        Best Score: {bestScore !== null ? bestScore : '—'}
                    </Text>
                </View>
                <Button
                    size="sm"
                    className="bg-white"
                    onPress={handleLogout}
                >
                    <Button.Label className="text-black font-bold">Logout</Button.Label>
                </Button>
            </Animated.View>

            <ScrollView contentContainerClassName="flex-grow bg-zinc-50 px-6 pt-12 pb-12">
                <Animated.View entering={FadeInDown.duration(500).delay(200)} className="items-center mb-0 relative">
                    <View className="w-80 h-80 items-center justify-center relative mt-2">
                        <LottieView
                            ref={lottieRef}
                            source={require('../../assets/lottie/guess-cat.json')}
                            loop={false}
                            style={{ width: '100%', height: '100%' }} />
                        <View
                            className="absolute z-10 items-center justify-center"
                            style={{
                                top: '4%', // Top edge of the speech bubble
                                left: '34%', // Left edge of the speech bubble
                                width: '55%', // Width of the bubble
                                height: '35%', // Height of the bubble text area
                            }}
                        >
                            {showHint && !!lastHint && (
                                <Animated.Text
                                    key={`hint-${guessCount}`}
                                    entering={FadeIn.delay(200)}
                                    exiting={FadeOut.duration(200)}
                                    className="text-2xl text-white font-bold text-center"
                                    style={{
                                        textAlignVertical: 'center',
                                    }}
                                >
                                    {lastHint}
                                </Animated.Text>
                            )}
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={BounceIn.duration(800).delay(300)} className="mt-auto bg-white rounded-[40px] p-8 shadow-2xl shadow-zinc-200 items-center border border-white">
                    <View className="bg-zinc-100 px-6 py-2 rounded-full mb-8">
                        <Text className="text-zinc-600 font-semibold">
                            Attempts: <Text className="text-zinc-900 font-black">{guessCount}</Text>
                        </Text>
                    </View>

                    <View className="flex-row items-center justify-center w-full mb-8">
                        <PressableFeedback
                            className={`w-16 h-16 rounded-full items-center justify-center bg-zinc-100 active:bg-zinc-200 shadow-sm ${currentGuess <= MIN_VALUE || isGameOver ? 'opacity-40' : ''}`}
                            onPressIn={handleDecrementIn}
                            onPressOut={handleDecrementOut}
                            isDisabled={currentGuess <= MIN_VALUE || isGameOver}
                        >
                            <PressableFeedback.Ripple />
                            <Text className="text-4xl font-black text-zinc-800 mt-[-4px]">−</Text>
                        </PressableFeedback>

                        <View className="w-36 items-center justify-center mx-2 h-[100px]">
                            <RollingCounter value={currentGuess} />
                        </View>

                        <PressableFeedback
                            className={`w-16 h-16 rounded-full items-center justify-center bg-zinc-100 active:bg-zinc-200 shadow-sm ${currentGuess >= MAX_VALUE || isGameOver ? 'opacity-40' : ''}`}
                            onPressIn={handleIncrementIn}
                            onPressOut={handleIncrementOut}
                            isDisabled={currentGuess >= MAX_VALUE || isGameOver}
                        >
                            <PressableFeedback.Ripple />
                            <Text className="text-4xl font-black text-zinc-800 mt-[-4px]">+</Text>
                        </PressableFeedback>
                    </View>

                    <Animated.View className="w-full" entering={FadeIn.delay(400)}>
                        <Pressable
                            className="w-full bg-zinc-900 rounded-2xl py-5 items-center justify-center active:bg-black shadow-lg shadow-zinc-300"
                            onPress={handleSubmit}
                        >
                            <Text
                                className="text-white text-2xl tracking-wide uppercase"
                                style={{ fontFamily: 'Bangers' }}
                            >
                                Guess!
                            </Text>
                        </Pressable>
                    </Animated.View>
                </Animated.View>
            </ScrollView>
        </>
    );
}
