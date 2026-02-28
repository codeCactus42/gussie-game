import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { Button, Input, Label, TextField } from 'heroui-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, error } = useAuthStore();
    const router = useRouter();

    const handleLogin = async () => {
        await login(username, password);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-background"
        >
            <ScrollView contentContainerClassName="flex-grow justify-center p-6 pb-12">
                <View className="items-center mb-10 mt-10">
                    <Image
                        source={require('../../assets/images/icon.png')}
                        className="mb-4 shadow-sm"
                        style={{ width: 96, height: 96, borderRadius: 24 }}
                        contentFit="cover"
                        transition={200}
                    />
                    <Text className="text-5xl text-brand mb-2 mt-4 px-2 text-center" style={{ fontFamily: 'Bangers_400Regular' }}>Guess The Number!</Text>
                    <Text className="text-lg text-muted-foreground text-center font-sans-medium">Welcome back! Please login.</Text>
                </View>

                <View className="p-4 gap-2">
                    <TextField>
                        <Label className="text-foreground font-semibold">Username</Label>
                        <Input
                            placeholder="Enter username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                            className="w-full bg-background border border-muted/50 focus:border-foreground rounded-lg text-base shadow-transparent"
                        />
                    </TextField>

                    <TextField>
                        <Label className="text-foreground font-semibold">Password</Label>
                        <Input
                            placeholder="Enter password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            className="w-full bg-background border border-muted/50 focus:border-foreground rounded-lg text-base shadow-transparent"
                        />
                    </TextField>

                    {error ? (
                        <Text className="text-red-500 text-sm text-center font-sans-medium mt-2">{error}</Text>
                    ) : null}

                    <Button
                        variant="primary"
                        onPress={handleLogin}
                        className="mt-4 bg-foreground rounded-lg"
                        feedbackVariant="scale-ripple"
                        animation={{ ripple: { backgroundColor: { value: '#e0e0e0' } } }}
                    >
                        <Button.Label className="text-background font-sans-bold text-lg">Login</Button.Label>
                    </Button>
                </View>

                <View className="flex-row justify-center mt-8">
                    <Text className="text-base">Don't have an account? </Text>
                    <Link href="/(auth)/register" asChild>
                        <Pressable>
                            <Text className="font-bold text-base">Register</Text>
                        </Pressable>
                    </Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
