// ============================================================================
// IMPORTS: Iconos, efectos, estado y componentes UI
// ============================================================================
import { Ionicons } from '@expo/vector-icons';
// Iconos para alertas, estados, warning
import { useFocusEffect } from 'expo-router';
// Hook que se ejecuta cuando la pantalla obtiene el foco (se hace visible)
import { useCallback, useState } from 'react';
// useState: estados locales de alertas
// useCallback: memoizar la función de carga de alertas
import { Alert, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
// Modal: diálogo modal para mostrar alerta activa
// ScrollView: contenedor scrolleable para historial
// TouchableOpacity: botón clickeable con opacidad
import { AlertData, StorageManager } from '../../utils/StorageManager';
// AlertData: tipo de datos de una alerta
// StorageManager: servicio de persistencia de alertas

// ============================================================================
// COMPONENTE: AlertsScreen (Gestión de alertas y historial)
// ============================================================================
/**
 * Pantalla de gestión de alertas de intrusión.
 * Responsabilidades:
 * 1. Mostrar alertas ACTIVAS en modal urgente
 * 2. Mostrar historial de alertas RESUELTAS/CERRADAS
 * 3. Permitir confirmar o descartar amenazas
 * 4. Permitir limpiar el historial completo
 * 
 * EASTER EGG:
 * - Long press (1.5s) en el título para borrar historial
 */
export default function AlertsScreen() {
  // ========================================================================
  // ESTADOS: Alertas y modal
  // ========================================================================
  /**
   * alerts: lista completa de alertas desde storage
   * setAlerts: función para actualizar la lista
   */
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  
  /**
   * activeAlert: alerta activa actual (la que debe mostrarse en modal)
   * setActiveAlert: función para actualizar el modal
   * null = sin alerta activa = modal cerrado
   */
  const [activeAlert, setActiveAlert] = useState<AlertData | null>(null);

  // ========================================================================
  // EFECTO: Cargar alertas cuando la pantalla obtiene el foco
  // ========================================================================
  /**
   * useFocusEffect: se ejecuta cuando el usuario navega a esta pantalla
   * useCallback: memoriza la función para evitar re-renders innecesarios
   * 
   * Esto asegura que el historial siempre esté actualizado cuando
   * el usuario abre la pestaña de alertas.
   */
  useFocusEffect(
    useCallback(() => {
      loadAlerts();
    }, []) // Dependencias vacías = ejecutar solo en cada foco
  );

  // ========================================================================
  // FUNCIÓN: loadAlerts (Cargar alertas desde storage)
  // ========================================================================
  /**
   * Lee las alertas desde AsyncStorage y actualiza los estados.
   * Pasos:
   * 1. Obtener todas las alertas del storage
   * 2. Actualizar estado general (setAlerts)
   * 3. Buscar la primera alerta con estado='Activa'
   * 4. Si existe, asignarla a activeAlert para mostrar modal
   */
  const loadAlerts = async () => {
    // 1. Leer del storage
    const data = await StorageManager.getAlerts();
    
    // 2. Actualizar lista completa
    setAlerts(data);
    
    // 3 y 4. Buscar alerta activa o null si no hay
    setActiveAlert(data.find(a => a.estado === 'Activa') || null);
  };

  // ========================================================================
  // FUNCIÓN: handleDecision (Resolver una alerta)
  // ========================================================================
  /**
   * Se ejecuta cuando el usuario presiona "Confirmar Amenaza" o "Falsa Alarma"
   * 
   * Pasos:
   * 1. Actualizar estado de la alerta a 'Resuelta/Cerrada' en storage
   * 2. Recargar las alertas (se cierra el modal automáticamente)
   * 
   * Nota: el parámetro 'decision' no se usa actualmente, pero permite
   * registrar si fue confirmada como amenaza real o falsa alarma.
   */
  const handleDecision = async (id_alerta: string, decision: string) => {
    // 1. Marcar alerta como resuelta en storage
    await StorageManager.updateAlertStatus(id_alerta, 'Resuelta/Cerrada');
    
    // 2. Recargar alertas (el modal se cierra porque activeAlert = null)
    loadAlerts(); 
  };

  // ========================================================================
  // FUNCIÓN: handleWipeData (Limpiar historial - Easter egg)
  // ========================================================================
  /**
   * Se ejecuta con long press (1.5s) en el título del historial.
   * Muestra confirmación antes de borrar todos los datos.
   */
  const handleWipeData = async () => {
    // Mostrar dialogo nativo de confirmacion
    Alert.alert(
      "Reinicio",           // Titulo del dialogo
      "¿Borrar historial?", // Mensaje/pregunta al usuario
      [
        // BOTON 1: Opcion de cancelar (segura)
        { 
          text: "Cancelar",  // Etiqueta del boton
          style: "cancel"    // Estilo: cancelacion (no destructiva)
          // No tiene onPress = simplemente cierra el dialogo sin hacer nada
        },
        
        // BOTON 2: Opcion de limpiar (peligrosa - DESTRUCTIVA)
        // - text: \"Limpiar\" = etiqueta del boton
        // - style: \"destructive\" = color ROJO en iOS (advertencia visual)
        // - onPress: funcion que se ejecuta al presionar\n        //   IMPORTANTE: Esta accion es IRREVERSIBLE\n        //   Borra completamente TODOS los datos de alertas
        { 
          text: "Limpiar",
          style: "destructive",
          onPress: async () => {
            // PASO 1: Borrar completamente todos los datos\n            // StorageManager.clearAll() elimina la clave '@notevi_alerts'\n            // Esta es una accion IRREVERSIBLE - no se puede recuperar\n            await StorageManager.clearAll();\n            \n            // PASO 2: Recargar alertas desde storage (ahora esta vacio)\n            // loadAlerts() interna:\n            //   1. getAlerts() -> lee storage, retorna [] (vacio)\n            //   2. setAlerts([]) -> actualiza estado, limpia lista visual\n            //   3. setActiveAlert(null) -> cierra modal si esta abierto\n            //   4. La UI renderiza \"Sin eventos registrados\"\n            loadAlerts();
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6 pt-16">
        <TouchableWithoutFeedback onLongPress={handleWipeData} delayLongPress={1500}>
          <View className="mb-8">
            <Text className="text-3xl font-bold text-primary tracking-tight">Historial de Alertas</Text>
            <Text className="text-secondary text-sm mt-1">Registro de eventos perimetrales resueltos</Text>
          </View>
        </TouchableWithoutFeedback>
        
        {alerts.filter(a => a.estado !== 'Activa').length === 0 ? (
          <View className="bg-surface p-6 rounded-xl border border-gray-800 items-center justify-center h-48 mt-10">
             <Ionicons name="checkmark-circle-outline" size={48} color="#A0A0A0" className="mb-2" />
            <Text className="text-primary font-medium text-lg">Sin eventos registrados</Text>
          </View>
        ) : (
          alerts.filter(a => a.estado !== 'Activa').map((alerta) => (
            <View key={alerta.id_alerta} className="bg-surface p-4 rounded-xl border border-gray-800 mb-4 flex-row justify-between items-center">
              <View>
                <Text className="text-primary font-bold text-lg">{alerta.zona}</Text>
                <Text className="text-secondary text-xs">{new Date(alerta.timestamp).toLocaleString()}</Text>
              </View>
              <View className="bg-gray-700 px-3 py-1 rounded-full">
                <Text className="text-primary text-xs font-bold uppercase">{alerta.estado}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={!!activeAlert} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/90 justify-center px-6">
          <View className="bg-surface p-6 rounded-2xl border-2 border-critico shadow-2xl">
            <View className="items-center mb-6">
              <Ionicons name="warning" size={64} color="#FF4C4C" />
              <Text className="text-critico text-2xl font-bold tracking-widest uppercase mt-2">¡Intrusión Detectada!</Text>
            </View>

            <View className="bg-background p-4 rounded-xl mb-8 border border-gray-800">
              <View className="flex-row justify-between mb-2">
                <Text className="text-secondary">Sensor ID:</Text>
                <Text className="text-primary font-bold">{activeAlert?.id_sensor}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-secondary">Zona:</Text>
                <Text className="text-primary font-bold">{activeAlert?.zona}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-secondary">Nivel de Certeza:</Text>
                <Text className="text-critico font-bold">{activeAlert?.nivel_certeza}%</Text>
              </View>
            </View>

            <View className="space-y-4">
              <TouchableOpacity className="bg-critico py-4 rounded-xl items-center mb-4" onPress={() => handleDecision(activeAlert!.id_alerta, 'Confirmar')}>
                <Text className="text-white font-bold text-lg uppercase tracking-wide">Confirmar Amenaza</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-700 py-4 rounded-xl items-center" onPress={() => handleDecision(activeAlert!.id_alerta, 'Falsa Alarma')}>
                <Text className="text-primary font-bold text-lg uppercase tracking-wide">Falsa Alarma</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}