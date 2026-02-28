import { BlurView, type BlurViewProps } from "expo-blur";
import { memo, useEffect, useState, type FC } from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated, {
    Easing,
    interpolate,
    useAnimatedProps,
    useAnimatedReaction,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming,
    type SharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export interface ICounter {
    value: number | SharedValue<number>;
    height?: number;
    width?: number;
    fontSize?: number;
    color?: string;
    springConfig?: any;
}

export interface IReusableDigit {
    place: number;
    counterValue: SharedValue<number>;
    height: number;
    width: number;
    color: string;
    fontSize: number;
    springConfig: any;
}

export const SPRING_CONFIG = {
    damping: 35,
    stiffness: 400,
};

const AnimatedBlur = Animated.createAnimatedComponent(BlurView as any);

const getDigitAtPlace = <T extends number, I extends number>(
    num: T,
    index: I,
): number => {
    "worklet";
    const str = Math.abs(Math.floor(num)).toString();
    return parseInt(str[str.length - 1 - index] || "0", 10);
};

const getDigitCount = <T extends number>(num: T): number => {
    "worklet";
    return Math.max(Math.abs(Math.floor(num)).toString().length, 1);
};

const CounterDigit: FC<IReusableDigit> = memo<IReusableDigit>(
    ({
        place,
        counterValue,
        height,
        width,
        color,
        fontSize,
        springConfig,
    }: IReusableDigit):
        | (React.JSX.Element & React.ReactNode & React.ReactElement)
        | null => {
        const currentDigit = useDerivedValue<number>(() =>
            getDigitAtPlace(counterValue.value, place),
        );

        const slideY = useSharedValue<number>(0);

        const digitSlideStylez = useAnimatedStyle<Pick<ViewStyle, "transform">>(
            () => {
                const targetY = -height * currentDigit.value;

                slideY.value = withSpring(targetY, {
                    ...springConfig,
                });

                return {
                    transform: [{ translateY: slideY.value }],
                };
            },
        );

        const blurEffectPropz = useAnimatedProps<Pick<BlurViewProps, "intensity">>(
            () => {
                const targetY = -height * currentDigit.value;
                const delta = Math.abs(slideY.value - targetY);
                const isMoving = delta > 0.5;

                return {
                    intensity: isMoving
                        ? withSpring<number>(interpolate(delta, [0, height], [0, 3.5]))
                        : 0,
                };
            },
        );

        return (
            <View
                style={{
                    height,
                    width,
                    overflow: "hidden",
                }}
            >
                <Animated.View style={digitSlideStylez}>
                    {Array.from({ length: 10 }, (_, i) => (
                        <Text
                            key={i}
                            style={{
                                height,
                                width,
                                textAlign: "center",
                                lineHeight: height,
                                fontSize,
                                fontFamily: "Bangers",
                                color,
                                fontVariant: ["tabular-nums"],
                                includeFontPadding: false,
                                letterSpacing: i === 1 ? -6 : -2, // pull 1 digits closer
                                transform: i === 1 ? [{ translateX: -4 }] : [], // visually center it better
                            }}
                        >
                            {i}
                        </Text>
                    ))}
                    {Platform.OS === "ios" && (
                        <AnimatedBlur
                            animatedProps={blurEffectPropz}
                            style={StyleSheet.absoluteFill}
                            pointerEvents="none"
                            tint="default"
                        />
                    )}
                </Animated.View>
            </View>
        );
    },
);

const RollingCounter: FC<ICounter> = memo(
    ({
        value,
        height = 100,
        width = 60,
        fontSize = 96, // 8xl
        color = "#09090b", // text-zinc-950
        springConfig = SPRING_CONFIG,
    }: ICounter):
        | (React.JSX.Element & React.ReactNode & React.ReactElement)
        | null => {
        const internalCounter = useSharedValue<number>(0);
        const animatedValue = typeof value === "number" ? internalCounter : value;

        const [totalDigits, setTotalDigits] = useState<number>(() => {
            const initialValue = typeof value === "number" ? value : value.value;
            return getDigitCount<number>(initialValue);
        });

        useEffect(() => {
            if (typeof value === "number") {
                internalCounter.value = value;
            }
        }, [value]);

        useAnimatedReaction<number>(
            () => getDigitCount<number>(animatedValue.value),
            (newCount, prevCount) => {
                if (newCount !== prevCount) {
                    scheduleOnRN(setTotalDigits, newCount);
                }
            },
            [animatedValue],
        );

        const containerAnimStyle = useAnimatedStyle<
            Partial<Pick<ViewStyle, "width">>
        >(() => ({
            width: withTiming<number>(
                getDigitCount<number>(animatedValue.value) * width,
                {
                    duration: 250,
                    easing: Easing.inOut(Easing.ease),
                },
            ),
        }));

        return (
            <Animated.View style={[styles.rowContainer, containerAnimStyle]}>
                {Array.from({ length: totalDigits }, (_, i) => {
                    const placeIndex = totalDigits - 1 - i;
                    return (
                        <CounterDigit
                            key={placeIndex}
                            springConfig={springConfig}
                            place={placeIndex}
                            counterValue={animatedValue}
                            height={height}
                            width={width}
                            color={color}
                            fontSize={fontSize}
                        />
                    );
                })}
            </Animated.View>
        );
    },
);

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        overflow: "hidden",
    },
});

export { RollingCounter };
