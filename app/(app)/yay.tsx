import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { BounceIn, FadeInDown } from 'react-native-reanimated';
import { useGameStore } from '../../src/store/useGameStore';

export default function YayScreen() {
    const router = useRouter();
    const { startNewGame, guessCount } = useGameStore();

    const handlePlayAgain = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        startNewGame();
        router.back();
    };

    return (
        <View className="flex-1 bg-zinc-50 items-center justify-center px-6">
            <Animated.View entering={FadeInDown.duration(600)} className="items-center mb-8">
                <Text className="text-5xl font-black text-zinc-900 mb-2" style={{ fontFamily: 'Bangers' }}>
                    YAY!
                </Text>
                <Text className="text-lg text-zinc-600 font-semibold text-center">
                    You guessed it in <Text className="text-zinc-900 font-black">{guessCount}</Text> {guessCount === 1 ? 'try' : 'tries'}!
                </Text>
            </Animated.View>

            <Animated.View entering={BounceIn.duration(800).delay(300)} className="w-80 h-80 items-center justify-center mb-10">
                <LottieView
                    source={require('../../assets/lottie/yay-cat.json')}
                    autoPlay
                    loop
                    style={{ width: '100%', height: '100%' }}
                />
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(600).delay(600)} className="w-full max-w-sm">
                <Pressable
                    className="w-full bg-zinc-900 rounded-2xl py-5 items-center justify-center active:bg-black shadow-lg shadow-zinc-300"
                    onPress={handlePlayAgain}
                >
                    <Text className="text-white text-2xl tracking-wide uppercase" style={{ fontFamily: 'Bangers' }}>
                        Play Again
                    </Text>
                </Pressable>
            </Animated.View>
        </View>
    );
}
