import { Stack } from 'expo-router';

export default function AppLayout() {
    return (
        <Stack
            initialRouteName="onboarding"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="index" />
            <Stack.Screen name="yay" />
        </Stack>
    );
}
