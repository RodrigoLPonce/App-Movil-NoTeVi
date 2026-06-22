// ============================================================================
// IMPORTS: Iconos vectoriales, componentes deslizantes, interruptores y hooks
// ============================================================================
import { Ionicons } from '@expo/vector-icons';
// Iconos vectoriales para representar de forma gráfica los módulos de radar, geófono y alertas
import Slider from '@react-native-community/slider';
// Slider: Componente nativo de selección deslizante para calibración fina de hardware (umbral y metros)
import { useState } from 'react';
// Hook fundamental para capturar, mutar y persistir temporalmente la calibración de los periféricos
import { ScrollView, Switch, Text, View } from 'react-native';
// Componentes estructurales de diseño plano y conmutación binaria de estados en iOS y Android

// ============================================================================
// COMPONENTE: SettingsScreen (Panel de Calibración de Hardware Perimetral)
// ============================================================================
/**
 * Pantalla de configuración avanzada para los sensores y periféricos del sistema NoTeVi.
 * Responsabilidades:
 * 1. Ajustar de forma lineal los rangos de alcance métrico del radar volumétrico de microondas.
 * 2. Modificar porcentualmente los umbrales de sensibilidad sísmica del geófono de tierra.
 * 3. Habilitar o silenciar las interrupciones del hilo de notificaciones push críticas.
 * 4. Desplegar la ficha de información sobre el algoritmo de lógica analítica/dual activa.
 */
export default function SettingsScreen() {
  // ========================================================================
  // ESTADOS LOCALES: Parámetros de Calibración de Sensores
  // ========================================================================
  /**
   * radarDist: Distancia de barrido o cobertura del radar Doppler (escalada de 2m a 12m).
   */
  const [radarDist, setRadarDist] = useState(8);

  /**
   * geoSens: Sensibilidad de filtrado de ondas mecánicas del geófono (porcentual de 0% a 100%).
   */
  const [geoSens, setGeoSens] = useState(60);

  /**
   * pushEnabled: Estado binario del daemon o canal de alertas del sistema de mensajería push.
   */
  const [pushEnabled, setPushEnabled] = useState(true);

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-5 pt-12">
        
        {/* ENCABEZADO DE CONTROL TÉCNICO */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-primary">Configuración</Text>
          <Text className="text-secondary text-sm mt-1">Ajusta los sensores de tu sistema</Text>
        </View>

        {/* ========================================================================
            TARJETA 1: Calibración Volumétrica - Radar de Microondas LD2410
            ======================================================================== */}
        <View className="bg-surface p-5 rounded-xl mb-5 border border-gray-800">
          {/* Ficha Descriptiva y Métrica Actual */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Ionicons name="radio-outline" size={24} color="#00E676" />
              <View className="ml-3">
                <Text className="text-primary font-bold text-base">Radar LD2410</Text>
                <Text className="text-secondary text-xs">Distancia de detección</Text>
              </View>
            </View>
            <Text className="text-operativo font-bold font-mono text-lg">{radarDist}m</Text>
          </View>
          
          {/* Potenciómetro Deslizante Lineal */}
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={2}
            maximumValue={12}
            step={1}
            value={radarDist}
            onValueChange={setRadarDist} // Modificación reactiva del alcance del radar en tiempo de ejecución
            minimumTrackTintColor="#00E676"
            maximumTrackTintColor="#333333"
            thumbTintColor="#FFFFFF"
          />
          {/* Cotas Límites del Perímetro */}
          <View className="flex-row justify-between mb-4">
            <Text className="text-secondary text-xs font-mono">2m</Text>
            <Text className="text-secondary text-xs font-mono">12m</Text>
          </View>

          {/* Información Técnica de Cobertura */}
          <Text className="text-secondary text-xs leading-relaxed border-t border-gray-800 pt-3">
            <Ionicons name="information-circle-outline" size={14} /> Define el rango máximo en metros para detectar presencia humana. Mayor distancia = mayor cobertura.
          </Text>
        </View>

        {/* ========================================================================
            TARJETA 2: Calibración Sismológica - Geófono SM-24
            ======================================================================== */}
        <View className="bg-surface p-5 rounded-xl mb-5 border border-gray-800">
          {/* Ficha Descriptiva y Porcentaje de Sensibilidad */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Ionicons name="water-outline" size={24} color="#00E676" />
              <View className="ml-3">
                <Text className="text-primary font-bold text-base">Geófono</Text>
                <Text className="text-secondary text-xs">Sensibilidad de vibración</Text>
              </View>
            </View>
            <Text className="text-operativo font-bold font-mono text-lg">{geoSens}%</Text>
          </View>
          
          {/* Selector Deslizante por Pasos (Steps) */}
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={100}
            step={10} // Calibración segmentada cada 10 unidades para mayor estabilidad analógica
            value={geoSens}
            onValueChange={setGeoSens} // Modificación del umbral de disparo por vibración mecánica
            minimumTrackTintColor="#00E676"
            maximumTrackTintColor="#333333"
            thumbTintColor="#FFFFFF"
          />
          {/* Escala de Tolerancia Táctica */}
          <View className="flex-row justify-between mb-4">
            <Text className="text-secondary text-xs">Baja</Text>
            <Text className="text-secondary text-xs">Alta</Text>
          </View>

          {/* Información Técnica del Filtro de Frecuencias de Tierra */}
          <Text className="text-secondary text-xs leading-relaxed border-t border-gray-800 pt-3">
            <Ionicons name="information-circle-outline" size={14} /> Ajusta la sensibilidad para detectar pisadas y vibraciones. Mayor sensibilidad detecta movimientos más leves.
          </Text>
        </View>

        {/* ========================================================================
            TARJETA 3: Interrupción de Notificaciones (Daemon de Red Push)
            ======================================================================== */}
        <View className="bg-surface p-5 rounded-xl mb-5 border border-gray-800 flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            <Ionicons name="notifications-outline" size={24} color="#00E676" />
            <View className="ml-3 pr-4">
              <Text className="text-primary font-bold text-base">Notificaciones Push</Text>
              <Text className="text-secondary text-xs">Alertas críticas al instante</Text>
            </View>
          </View>
          {/* Conmutador Binario de Estado de Notificaciones */}
          <Switch
            trackColor={{ false: "#333333", true: "#00E676" }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#333333"
            onValueChange={setPushEnabled}
            value={pushEnabled}
          />
        </View>

        {/* ========================================================================
            SECCIÓN INFORMATIVA: Consistencia y Lógica de Validación Dual Activa
            ======================================================================== */}
        <View className="bg-surface/50 p-5 rounded-xl border border-operativo/30 mb-10">
          <Text className="text-operativo font-bold text-sm mb-2">Validación Dual Activa</Text>
          <Text className="text-secondary text-xs leading-relaxed">
            Tu sistema NoTeVi solo enviará alertas cuando <Text className="text-primary font-bold">ambos sensores</Text> confirmen una intrusión. Esto elimina las falsas alarmas causadas por animales, viento o vehículos cercanos.
          </Text>
        </View>
        
        {/* Espaciador Estructural Inferior para Desplazamiento Seguro */}
        <View className="h-6" />
      </ScrollView>
    </View>
  );
}