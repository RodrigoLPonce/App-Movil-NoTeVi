import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { StorageManager } from '../../utils/StorageManager';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [activeAlert, setActiveAlert] = useState<AlertData | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadAlerts();
    }, [])
  );

  const loadAlerts = async () => {
    const data = await StorageManager.getAlerts();
    setAlerts(data);
    setActiveAlert(data.find(a => a.estado === 'Activa') || null);
  };

  const handleDecision = async (id_alerta: string, decision: string) => {
    await StorageManager.updateAlertStatus(id_alerta, 'Resuelta/Cerrada');
    loadAlerts(); 
  };

  const handleWipeData = async () => {
    Alert.alert("Reinicio", "¿Borrar historial?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Limpiar", style: "destructive", onPress: async () => {
          await StorageManager.clearAll();
          loadAlerts();
        }
      }
    ]);
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