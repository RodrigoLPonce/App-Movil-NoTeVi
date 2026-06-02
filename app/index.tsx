import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const user = username.toLowerCase().trim();
    if (user === 'guardia' && password === '1234') {
      router.replace('/(tabs)/dashboard');
    } else {
      Alert.alert('Acceso Denegado', 'Credenciales inválidas.');
    }
  };

  return (
    <View className="flex-1 justify-center px-8 bg-background">
      <View className="mb-12">
        <Text className="text-5xl font-bold text-primary mb-2">NoTeVi</Text>
        <Text className="text-secondary text-base border-l-2 border-action pl-3">Módulo de Monitoreo Activo</Text>
      </View>

      <View className="bg-surface p-6 rounded-xl border border-gray-800">
        <TextInput
          className="bg-background text-primary px-4 py-4 rounded-lg mb-4 border border-gray-700"
          placeholder="ID de Operador"
          placeholderTextColor="#A0A0A0"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          className="bg-background text-primary px-4 py-4 rounded-lg mb-8 border border-gray-700"
          placeholder="Código de Acceso"
          placeholderTextColor="#A0A0A0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity className="bg-action py-4 rounded-lg items-center" onPress={handleLogin}>
          <Text className="text-primary font-bold text-lg uppercase">Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}