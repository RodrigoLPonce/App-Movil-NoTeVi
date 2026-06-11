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

// ============================================================================
// IMPORTS: Iconos, navegación, estado y componentes
// ============================================================================
import { Ionicons } from '@expo/vector-icons';
// Iconos para visualizar estado de hardware
import { router } from 'expo-router';
// Navegación programática entre pantallas
import { useRef, useState } from 'react';
// useState: estado local del contador de taps
// useRef: referencia persistente para el timeout del easter egg
import { Alert, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
// ScrollView: contenedor scrolleable vertical
// TouchableWithoutFeedback: área clickeable sin feedback visual
import { StorageManager } from '../../utils/StorageManager';
// StorageManager: servicio para inyectar alertas mock en testing

// ============================================================================
// COMPONENTE: DashboardScreen (Panel de monitoreo en tiempo real)
// ============================================================================
/**
 * Pantalla principal de monitoreo del sistema NoTeVi.
 * Muestra:
 * - Estado general del nodo perimetral (NODO-ZONA-A)
 * - Estado de conectividad de cada sensor:
 *   • MainBoard (placa principal)
 *   • Radar LD2410-C (detección de movimiento)
 *   • Geófono SM-24 (detección de vibración)
 *   • Micrófono INMP441 (captura de audio)
 * 
 * EASTER EGG DE TESTING:
 * - Presionar 3x el título "Estado del Sistema" en 2 segundos
 * - Inyecta una alerta mock después de 5 segundos
 * - Navega automáticamente a la pantalla de alertas
 */
export default function DashboardScreen() {
  // ========================================================================
  // ESTADOS: Contador para easter egg
  // ========================================================================
  /**
   * tapCount: número de taps detectados en el título
   * Se usa para el easter egg: si llega a 3 en 2 segundos, inyecta alerta
   */
  const [tapCount, setTapCount] = useState(0);
  
  /**
   * timerRef: referencia persistente al timeout del easter egg
   * Permite acceder al setTimeout fuera del hook
   */
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ========================================================================
  // FUNCIÓN: handleSecretTap (Easter egg - Simulador de alertas)
  // ========================================================================
  /**
   * Se ejecuta cada vez que el usuario presiona el título.
   * Logica:
   * 1. Incrementa contador de taps
   * 2. Si tapCount === 3:
   *    - Muestra alerta de confirmación
   *    - Espera 5 segundos
   *    - Inyecta una alerta mock en AsyncStorage
   *    - Navega a la pantalla de alertas
   * 3. Si no hay tap en 2 segundos, reinicia el contador
   */
  const handleSecretTap = () => {
    // Incrementar contador
    const newCount = tapCount + 1;
    setTapCount(newCount);

    // Detectar si el usuario ha presionado 3 veces
    if (newCount === 3) {
      // Mostrar confirmación al usuario
      Alert.alert("Simulador", "Alerta programada en 5s.");
      
      // Ejecutar después de 5 segundos
      timerRef.current = setTimeout(async () => {
        // 1. Inyectar alerta mock en storage
        await StorageManager.injectMockAlert();
        
        // 2. Navegar a la pantalla de alertas
        router.push('/(tabs)/alerts');
        
        // 3. Reiniciar contador
        setTapCount(0);
      }, 5000); // 5 segundos de espera
    }
    
    // Reiniciar contador si no hay tap en 2 segundos
    setTimeout(() => setTapCount(0), 2000);
  };

  // ========================================================================
  // RETORNO: UI del dashboard
  // ========================================================================
  return (
    // Contenedor scrolleable (para pantallas pequeñas)
    <ScrollView className="flex-1 bg-background px-6 pt-16">
      
      {/* ===== SECCIÓN 1: CABECERA (Título + Subtítulo) ===== */}
      {/* TouchableWithoutFeedback: área clickeable para el easter egg */}
      <TouchableWithoutFeedback onPress={handleSecretTap}>
        <View className="mb-8">
          {/* Título principal */}
          <Text className="text-3xl font-bold text-primary tracking-tight">
            Estado del Sistema
          </Text>
          {/* Subtítulo descriptivo */}
          <Text className="text-secondary text-sm mt-1">
            Verificación de conectividad en tiempo real (Lifecheck)
          </Text>
        </View>
      </TouchableWithoutFeedback>

      {/* ===== SECCIÓN 2: TARJETA DE ESTADO DEL NODO ===== */}
      <View className="bg-surface rounded-xl border border-gray-800 p-5 mb-6">
        
        {/* FILA 1: Nombre del nodo + Badge de estado */}
        <View className="flex-row justify-between items-center mb-4 border-b border-gray-700 pb-3">
          
          {/* Nombre del nodo con icono */}
          <View className="flex-row items-center">
            {/* Icono de hardware/chip */}
            <Ionicons 
              name="hardware-chip" 
              size={20} 
              color="#FFFFFF" 
              className="mr-2" 
            />
            {/* ID del nodo (en fuente monoespaciada para cumplir rúbrica) */}
            <Text className="text-primary font-bold text-lg font-mono">
              NODO-ZONA-A
            </Text>
          </View>
          
          {/* Badge de estado "OPERATIVO" */}
          <View className="bg-operativo/20 px-3 py-1 rounded-full border border-operativo/50">
            <Text className="text-operativo text-xs font-bold uppercase">
              Operativo
            </Text>
          </View>
        </View>

        {/* LISTADO DE SENSORES: Estado de cada componente */}
        
        {/* Sensor 1: MainBoard (placa principal) */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-secondary">MainBoard</Text>
          <Text className="text-operativo font-medium">Funcionamiento</Text>
        </View>
        
        {/* Sensor 2: Radar LD2410-C (detección de movimiento) */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-secondary">Radar LD2410-C</Text>
          <Text className="text-operativo font-medium">Operativo</Text>
        </View>
        
        {/* Sensor 3: Geófono SM-24 (detección de vibración) */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-secondary">Geófono SM-24</Text>
          <Text className="text-operativo font-medium">Funcionamiento</Text>
        </View>
        
        {/* Sensor 4: Micrófono INMP441 (captura de audio) */}
        <View className="flex-row justify-between items-center">
          <Text className="text-secondary">Micrófono INMP441</Text>
          <Text className="text-operativo font-medium">Funcionamiento</Text>
        </View>
      </View>
    </ScrollView>
  );
}