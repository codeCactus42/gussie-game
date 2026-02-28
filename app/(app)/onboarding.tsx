import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { StaggeredText } from '../../components/animated-text';

export default function OnboardingScreen() {
    const router = useRouter();
    const lottieRef = useRef<LottieView>(null);
    const [animationFinished, setAnimationFinished] = useState(false);
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        // Play the animation
        lottieRef.current?.play();

        // Start text animation at 1s 6f (approx 1250ms assuming 24fps)
        const textTimer = setTimeout(() => {
            setShowText(true);
        }, 1100);

        return () => clearTimeout(textTimer);
    }, []);

    useEffect(() => {
        if (animationFinished) {
            const navTimer = setTimeout(() => {
                router.replace('/' as any);
            }, 500); // 500ms fade out before routing
            return () => clearTimeout(navTimer);
        }
    }, [animationFinished, router]);

    const handleContinue = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setAnimationFinished(true);
    };

    return (
        <Animated.View
            className="flex-1 bg-zinc-50 items-center justify-center p-6"
            exiting={FadeOut.duration(500)}
        >
            <View className="absolute top-1/4 left-0 right-0 items-center px-8 z-10">
                {showText && (
                    <StaggeredText
                        text="I'm Thinking about a number between 1 - 43 , Can you guess it?"
                        style={{
                            fontSize: 32,
                            fontFamily: 'Bangers',
                            color: '#18181b',
                            textAlign: 'center',
                        }}
                        animationConfig={{
                            characterDelay: 40,
                        }}
                    />
                )}
            </View>

            <Animated.View
                entering={SlideInDown.duration(800).withInitialValues({ transform: [{ translateY: 400 }] })}
                className="absolute bottom-0 w-full items-center justify-center -z-10"
                style={{ height: '100%' }}
            >
                <LottieView
                    ref={lottieRef}
                    source={require('../../assets/lottie/onboarding-cat.json')}
                    loop={false}
                    onAnimationFinish={() => setShowText(true)}
                    style={{ width: '150%', height: '100%' }}
                />
            </Animated.View>

            {showText && (
                <Animated.View
                    entering={FadeIn.delay(2000).duration(800)}
                    className="absolute top-1/2 w-full px-8 z-20"
                    style={{ transform: [{ translateY: -28 }] }}
                >
                    <Pressable
                        className="w-full bg-zinc-900 rounded-2xl py-5 items-center justify-center active:bg-black shadow-lg shadow-zinc-300"
                        onPress={handleContinue}
                    >
                        <Text
                            className="text-white text-2xl tracking-wide uppercase"
                            style={{ fontFamily: 'Bangers' }}
                        >
                            Let's Play!
                        </Text>
                    </Pressable>
                </Animated.View>
            )}
        </Animated.View>
    );
}
