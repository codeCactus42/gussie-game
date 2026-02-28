import { useRouter } from 'expo-router';
import { Button, Card, Input, Label, TextField } from 'heroui-native';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { register, error, clearError } = useAuthStore();
    const router = useRouter();

    const handleRegister = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Username and password cannot be empty');
            return;
        }

        await register(username, password);

        // Check if error is set in the store after register call
        const currentError = useAuthStore.getState().error;
        if (!currentError) {
            Alert.alert('Success', 'Account created successfully!', [
                { text: 'OK', onPress: () => router.replace('/(auth)/login') }
            ]);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-background"
        >
            <ScrollView contentContainerClassName="flex-grow justify-center p-6 pb-12">
                <View className="items-center mb-10 mt-10">
                    <Text className="text-5xl text-brand mb-2 mt-4 text-center" style={{ fontFamily: 'Bangers_400Regular' }}>Create Account</Text>
                    <Text className="text-lg text-muted-foreground text-center font-sans-medium">Secure your best scores locally.</Text>
                </View>

                <Card className="p-2 border border-muted/20">
                    <Card.Body className="gap-4">
                        <TextField>
                            <Label className="text-foreground font-sans-semibold">Username</Label>
                            <Input
                                placeholder="Choose a username"
                                value={username}
                                onChangeText={(text) => {
                                    setUsername(text);
                                    if (error) clearError();
                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                className="w-full h-[52px] bg-background border border-muted/50 rounded-2xl px-4 text-foreground font-sans-medium text-base shadow-sm"
                                placeholderColorClassName="text-muted-foreground/70"
                            />
                        </TextField>

                        <TextField>
                            <Label className="text-foreground font-sans-semibold">Password</Label>
                            <Input
                                placeholder="Choose a strong password"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (error) clearError();
                                }}
                                secureTextEntry
                                className="w-full h-[52px] bg-background border border-muted/50 rounded-2xl px-4 text-foreground font-sans-medium text-base shadow-sm"
                                placeholderColorClassName="text-muted-foreground/70"
                            />
                        </TextField>

                        {error ? (
                            <Text className="text-brand text-sm text-center font-sans-medium mt-2">{error}</Text>
                        ) : null}

                        <Button
                            variant="primary"
                            onPress={handleRegister}
                            className="mt-4 bg-foreground"
                            feedbackVariant="scale-ripple"
                            animation={{ ripple: { backgroundColor: { value: '#e0e0e0' } } }}
                        >
                            <Button.Label className="text-background font-sans-bold text-lg">Register</Button.Label>
                        </Button>
                    </Card.Body>
                </Card>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}
