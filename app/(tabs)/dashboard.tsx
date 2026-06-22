// ============================================================================
// IMPORTS: Iconos, enrutador, referencias, estado y componentes UI nativos
// ============================================================================
import { Ionicons } from '@expo/vector-icons';
// Iconos vectoriales para representar el hardware de los nodos y el estado del radar
import { router } from 'expo-router';
// Enrutador nativo para redirigir dinámicamente al usuario entre pantallas
import { useRef, useState } from 'react';
// useState: Control del contador de toques para activar la secuencia secreta
// useRef: Persistencia de la referencia del temporizador para evitar fugas de memoria
import { Alert, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
// Componentes base para capturar gestos sin efecto visual e implementar el scroll
import { StorageManager } from '../../utils/StorageManager';
// StorageManager: Servicio de persistencia para inyectar alertas simuladas de prueba

// ============================================================================
// COMPONENTE: DashboardScreen (Monitoreo de Telemetría y Estado de Hardware)
// ============================================================================
/**
 * Pantalla principal del centro de comando (Dashboard).
 * Responsabilidades:
 * 1. Mostrar de forma gráfica el estado general del sistema (Escudo de Zona Segura).
 * 2. Listar la salud y conexión de los componentes acoplados al NODO-ZONA-A.
 * 3. Simular un radar perimetral interactivo mediante vistas estilizadas.
 * * EASTER EGG / MODO SIMULADOR:
 * - Al realizar 3 toques sobre el encabezado "Estado del Sistema", se gatilla un bypass 
 * mecanizado que inyecta una alerta de intrusión falsa y redirige al panel crítico.
 */
export default function DashboardScreen() {
  // ========================================================================
  // ESTADOS Y REFERENCIAS: Mecanismo secreto del simulador de eventos
  // ========================================================================
  /**
   * tapCount: Almacena la cantidad de toques consecutivos efectuados en la cabecera.
   */
  const [tapCount, setTapCount] = useState(0);

  /**
   * timerRef: Guarda la referencia del setTimeout asíncrono para poder limpiarlo o 
   * gestionarlo en ciclos de re-renderizado sin perder su identificador nativo.
   */
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ========================================================================
  // FUNCIÓN: handleSecretTap (Bypass táctico para simulación de intrusiones)
  // ========================================================================
  /**
   * Registra los toques en el título y evalúa la condición de inyección.
   * Flujo lógico:
   * 1. Incrementar el contador local de toques.
   * 2. Si se alcanzan exactamente 3 toques:
   * a. Mostrar una ventana de alerta nativa informando el inicio de la inyección.
   * b. Iniciar un retardo (timeout) de 1000ms para simular latencia de red.
   * c. Escribir en almacenamiento local la alerta mock (injectMockAlert).
   * d. Redirigir de forma forzada a la vista de alertas para activar el modal de emergencia.
   * e. Reiniciar el acumulador de toques.
   * 3. Planificar un limpiador automático que expira el contador a los 2000ms si no se completó la secuencia.
   */
  const handleSecretTap = () => {
    // 1. Cálculo del nuevo estado de toques
    const newCount = tapCount + 1;
    setTapCount(newCount);

    // 2. Evaluación del umbral secreto (Easter Egg)
    if (newCount === 3) {
      Alert.alert("Simulador", "Inyectando alerta en la nube...");
      
      // Simulación de latencia asíncrona de infraestructura
      timerRef.current = setTimeout(async () => {
        // Ejecución de la alerta simulada en el almacenamiento local
        await StorageManager.injectMockAlert(); 
        
        // Redirección forzada hacia la pantalla crítica del sistema de alertas
        router.push('/(tabs)/alerts'); 
        
        // Reset preventivo del estado
        setTapCount(0);
      }, 1000); 
    }
    
    // 3. Mecanismo de caducidad: Si el operador tarda más de 2s, la secuencia se invalida
    setTimeout(() => setTapCount(0), 2000);
  };

  return (
    <ScrollView className="flex-1 bg-background px-6 pt-16">
      
      {/* ========================================================================
          SECCIÓN: Cabecera con Capturador de Gestos Oculto (Simulador)
          ======================================================================== */}
      <TouchableWithoutFeedback onPress={handleSecretTap}>
        <View className="mb-6">
          <Text className="text-3xl font-bold text-primary tracking-tight">Estado del Sistema</Text>
          <Text className="text-secondary text-sm mt-1">Verificación de conectividad en tiempo real (Lifecheck)</Text>
        </View>
      </TouchableWithoutFeedback>

      {/* ========================================================================
          SECCIÓN: Escudo Visual Central (Estatus Operativo General)
          ======================================================================== */}
      <View className="items-center justify-center mb-8 mt-2">
        <View className="w-40 h-40 rounded-full border-[4px] border-operativo/30 items-center justify-center bg-operativo/10 shadow-[0_0_30px_rgba(0,230,118,0.15)]">
          <Ionicons name="shield-checkmark" size={56} color="#00E676" />
          <Text className="text-primary font-bold text-xl mt-2 tracking-widest uppercase">Armado</Text>
          <Text className="text-operativo text-xs font-mono">ZONA SEGURA</Text>
        </View>
      </View>

      {/* ========================================================================
          SECCIÓN: Ficha del Nodo Perimetral (Salud del Hardware)
          ======================================================================== */}
      <View className="bg-surface rounded-xl border border-gray-800 p-5 mb-6">
        {/* Encabezado e Identificador único del Microcontrolador */}
        <View className="flex-row justify-between items-center mb-4 border-b border-gray-700 pb-3">
          <View className="flex-row items-center">
            <Ionicons name="hardware-chip" size={20} color="#FFFFFF" className="mr-2" />
            <Text className="text-primary font-bold text-lg font-mono">NODO-ZONA-A</Text>
          </View>
          <View className="bg-operativo/20 px-3 py-1 rounded-full border border-operativo/50">
            <Text className="text-operativo text-xs font-bold uppercase">Operativo</Text>
          </View>
        </View>

        {/* Telemetría Individual de Sensores Integrados */}
        {/* Componente 1: Núcleo de Procesamiento */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-secondary">MainBoard</Text>
          <Text className="text-operativo font-medium">Funcionamiento</Text>
        </View>
        
        {/* Componente 2: Radar de Efecto Doppler e Infrarrojos */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-secondary">Radar LD2410-C</Text>
          <Text className="text-operativo font-medium">Operativo</Text>
        </View>
        
        {/* Componente 3: Sensor Sismológico Terrestre */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-secondary">Geófono SM-24</Text>
          <Text className="text-operativo font-medium">Funcionamiento</Text>
        </View>
        
        {/* Componente 4: Transductor Eléctrico de Frecuencias Auditivas */}
        <View className="flex-row justify-between items-center">
          <Text className="text-secondary">Micrófono INMP441</Text>
          <Text className="text-operativo font-medium">Funcionamiento</Text>
        </View>
      </View>

      {/* ========================================================================
          SECCIÓN: Vista Instrumental - Radar de Escaneo Continuo
          ======================================================================== */}
      <View className="bg-surface rounded-xl border border-gray-800 p-5 mb-10">
        <View className="flex-row items-center mb-4">
          <Ionicons name="scan-circle-outline" size={20} color="#A0A0A0" className="mr-2" />
          <Text className="text-primary font-bold">Vista Radar Sectorial</Text>
        </View>
        
        {/* Contenedor Gráfico del Radar de Barrido Simulado mediante CSS-Tailwind */}
        <View className="h-40 bg-[#0D1117] rounded-lg border border-gray-700 items-center justify-center relative overflow-hidden">
            {/* Retículas y Guías de Ejes de Coordenadas Plano Cartesiano */}
            <View className="absolute w-full h-[1px] bg-operativo/20" />
            <View className="absolute h-full w-[1px] bg-operativo/20" />
            
            {/* Anillos de Concentración de Rango y Distancia Perimetral */}
            <View className="w-48 h-48 rounded-full border border-operativo/20 absolute" />
            <View className="w-24 h-24 rounded-full border border-operativo/30 absolute" />
            
            {/* Indicador Luminiscente del Punto de Barrido Actual */}
            <View className="w-3 h-3 rounded-full bg-operativo absolute shadow-[0_0_15px_#00E676]" />
            
            {/* Etiqueta de Telemetría Dinámica */}
            <Text className="absolute bottom-2 left-2 text-gray-500 text-[10px] font-mono">ESTADO: ESCANEANDO...</Text>
        </View>
      </View>

    </ScrollView>
  );
}