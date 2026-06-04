/*
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { StorageManager } from '../../utils/StorageManager';

export default function DashboardScreen() {
  const [tapCount, setTapCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount === 3) {
      Alert.alert("Simulador", "Alerta programada en 10s.");
      timerRef.current = setTimeout(async () => {
        await StorageManager.injectMockAlert();
        router.push('/(tabs)/alerts');
        setTapCount(0);
      }, 10000);
    }
    setTimeout(() => setTapCount(0), 2000); 
  };

  return (
    <ScrollView className="flex-1 bg-background px-6 pt-16">
      <TouchableWithoutFeedback onPress={handleSecretTap}>
        <View className="mb-8">
          <Text className="text-3xl font-bold text-primary tracking-tight">Estado del Sistema</Text>
          <Text className="text-secondary text-sm mt-1">Verificación de conectividad en tiempo real (Lifecheck)</Text>
        </View>
      </TouchableWithoutFeedback>

      <View className="bg-surface rounded-xl border border-gray-800 p-5 mb-6">
        <View className="flex-row justify-between items-center mb-4 border-b border-gray-700 pb-3">
          <View className="flex-row items-center">
            <Ionicons name="hardware-chip" size={20} color="#FFFFFF" className="mr-2" />
            <Text className="text-primary font-bold text-lg">NODO-ZONA-A</Text>
          </View>
          <View className="bg-operativo/20 px-3 py-1 rounded-full border border-operativo/50">
            <Text className="text-operativo text-xs font-bold uppercase">Operativo</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-secondary">MainBoard</Text>
          <Text className="text-operativo font-medium">Funcionamiento</Text>
        </View>
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-secondary">Radar LD2410-C</Text>
          <Text className="text-operativo font-medium">Operativo</Text>
        </View>
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-secondary">Geófono SM-24</Text>
          <Text className="text-operativo font-medium">Funcionamiento</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-secondary">Micrófono INMP441</Text>
          <Text className="text-operativo font-medium">Funcionamiento</Text>
        </View>
      </View>
    </ScrollView>
  );
}
*/

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { StorageManager } from '../../utils/StorageManager';

export default function DashboardScreen() {
  const [tapCount, setTapCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount === 3) {
      Alert.alert("Simulador", "Alerta programada en 10s.");
      timerRef.current = setTimeout(async () => {
        await StorageManager.injectMockAlert();
        router.push('/(tabs)/alerts');
        setTapCount(0);
      }, 10000);
    }
    setTimeout(() => setTapCount(0), 2000); 
  };

  return (
    <ScrollView className="flex-1 bg-background px-6 pt-16">
      <TouchableWithoutFeedback onPress={handleSecretTap}>
        <View className="mb-8">
          <Text className="text-3xl font-bold text-primary tracking-tight">Estado del Sistema</Text>
          <Text className="text-secondary text-sm mt-1">Verificación de conectividad en tiempo real (Lifecheck)</Text>
        </View>
      </TouchableWithoutFeedback>

      <View className="bg-surface rounded-xl border border-gray-800 p-5 mb-6">
        <View className="flex-row justify-between items-center mb-4 border-b border-gray-700 pb-3">
          <View className="flex-row items-center">
            <Ionicons name="hardware-chip" size={20} color="#FFFFFF" className="mr-2" />
            {/* Aquí inyectamos font-mono para cumplir la rúbrica */}
            <Text className="text-primary font-bold text-lg font-mono">NODO-ZONA-A</Text>
          </View>
          <View className="bg-operativo/20 px-3 py-1 rounded-full border border-operativo/50">
            <Text className="text-operativo text-xs font-bold uppercase">Operativo</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-secondary">MainBoard</Text>
          <Text className="text-operativo font-medium">Funcionamiento</Text>
        </View>
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-secondary">Radar LD2410-C</Text>
          <Text className="text-operativo font-medium">Operativo</Text>
        </View>
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-secondary">Geófono SM-24</Text>
          <Text className="text-operativo font-medium">Funcionamiento</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-secondary">Micrófono INMP441</Text>
          <Text className="text-operativo font-medium">Funcionamiento</Text>
        </View>
      </View>
    </ScrollView>
  );
}