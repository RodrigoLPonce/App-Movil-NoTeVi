import AsyncStorage from '@react-native-async-storage/async-storage';

const ALERTS_KEY = '@notevi_alerts';

export interface AlertData {
  id_alerta: string;
  id_sensor: string;
  zona: string;
  nivel_certeza: number;
  timestamp: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  estado: 'Activa' | 'En Verificación' | 'Resuelta/Cerrada';
}

export class StorageManager {
  
  static async getAlerts(): Promise<AlertData[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(ALERTS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Error leyendo alertas:", e);
      return [];
    }
  }

  static async injectMockAlert(): Promise<AlertData> {
    const newAlert: AlertData = {
      id_alerta: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
      id_sensor: "SENS-PERIM-04",
      zona: "Perímetro Norte",
      nivel_certeza: 92,
      timestamp: new Date().toISOString(),
      prioridad: "Alta",
      estado: "Activa"
    };

    try {
      const currentAlerts = await this.getAlerts();
      const updatedAlerts = [newAlert, ...currentAlerts];
      await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));
      return newAlert;
    } catch (e) {
      console.error("Error inyectando mock:", e);
      throw e;
    }
  }

  static async updateAlertStatus(id_alerta: string, nuevo_estado: 'Resuelta/Cerrada'): Promise<void> {
    try {
      const currentAlerts = await this.getAlerts();
      const updatedAlerts = currentAlerts.map(alert =>
        alert.id_alerta === id_alerta ? { ...alert, estado: nuevo_estado } : alert
      );
      await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));
    } catch (e) {
      console.error("Error actualizando estado:", e);
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ALERTS_KEY);
    } catch (e) {
      console.error("Error limpiando memoria:", e);
    }
  }
}