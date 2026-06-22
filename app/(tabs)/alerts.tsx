// ============================================================================
// IMPORTS: Iconos, efectos de enfoque, hooks de React y componentes UI nativos
// ============================================================================
import { Ionicons } from '@expo/vector-icons';
// Iconos vectoriales para representar estados de advertencia y escudos de seguridad
import { useFocusEffect } from 'expo-router';
// Hook de navegación para ejecutar lógica asíncrona cada vez que la pantalla se visualiza
import { useCallback, useState } from 'react';
// useState: Manejo de estados locales para alertas y modales interactivos
// useCallback: Memoización de funciones para evitar re-renderizados innecesarios del efecto
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
// Componentes estructurales y de interfaz nativa para construir la UI en Android/iOS
import { AlertData, StorageManager } from '../../utils/StorageManager';
// AlertData: Interfaz/Tipo de datos estructural para los objetos de alerta
// StorageManager: Capa de servicio encargada de la persistencia (AsyncStorage)

// ============================================================================
// COMPONENTE: AlertsScreen (Registro de Actividad y Gestión Operativa)
// ============================================================================
/**
 * Pantalla de visualización, análisis y resolución de alertas perimetrales.
 * Responsabilidades:
 * 1. Cargar y segmentar las alertas almacenadas localmente.
 * 2. Calcular en tiempo real métricas clave (Alertas reales vs Eventos descartados).
 * 3. Interceptar y forzar un Modal Crítico prioritario si hay un evento con estado 'Activa'.
 * 4. Renderizar una línea de tiempo táctica detallando telemetría de sensores (Geófono y Radar).
 */
export default function AlertsScreen() {
  // ========================================================================
  // ESTADOS: Alertas persistidas y control del Modal de Emergencia
  // ========================================================================
  /**
   * alerts: Colección completa de alertas extraídas del almacenamiento local.
   */
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  
  /**
   * activeAlert: Almacena la alerta de intrusión actual que requiere acción inmediata.
   * Si es null, el modal de máxima prioridad permanece oculto.
   */
  const [activeAlert, setActiveAlert] = useState<AlertData | null>(null);

  // ========================================================================
  // EFECTO: Sincronización del foco de la pantalla
  // ========================================================================
  /**
   * Dispara la recarga de alertas cada vez que el usuario navega e ingresa a la vista.
   * Garantiza que los cambios realizados en otras pantallas se reflejen inmediatamente aquí.
   */
  useFocusEffect(
    useCallback(() => {
      loadAlerts();
    }, []) // Dependencias vacías para asegurar su ejecución única por evento de foco
  );

  // ========================================================================
  // FUNCIÓN: loadAlerts (Extracción y ruteo de datos)
  // ========================================================================
  /**
   * Recupera el listado desde StorageManager de forma asíncrona.
   * Pasos:
   * 1. Solicitar registros persistidos.
   * 2. Asignar la colección completa al estado local.
   * 3. Evaluar e interceptar si existe alguna alerta 'Activa' para desplegar el modal.
   */
  const loadAlerts = async () => {
    // 1. Obtención de datos del almacenamiento nativo
    const data = await StorageManager.getAlerts();
    
    // 2. Persistencia en el estado de la UI
    setAlerts(data);
    
    // 3. Extracción del primer evento crítico activo (si existe)
    setActiveAlert(data.find(a => a.estado === 'Activa') || null);
  };

  // ========================================================================
  // FUNCIÓN: handleDecision (Resolución operativa de incidencias)
  // ========================================================================
  /**
   * Procesa la acción tomada por el operador de seguridad frente a un evento.
   * Pasos:
   * 1. Actualizar el estado de la alerta en la base de datos local (Confirmar / Falsa Alarma).
   * 2. Refrescar el estado de la aplicación para cerrar el modal y actualizar la lista general.
   */
  const handleDecision = async (id_alerta: string, decision: string) => {
    // 1. Actualización asíncrona en almacenamiento de persistencia
    await StorageManager.updateAlertStatus(id_alerta, decision);
    
    // 2. Actualización de interfaz (provoca el cierre automático del modal si activeAlert pasa a null)
    loadAlerts(); 
  };

  // ========================================================================
  // MÉTRICAS CALCULADAS: Filtros en tiempo real para tarjetas de resumen
  // ========================================================================
  /**
   * alertasReales: Contador de eventos que se encuentran actualmente 'Activa' o
   * que han sido validados con 'Prioridad Alta'.
   */
  const alertasReales = alerts.filter(a => a.estado === 'Activa' || a.prioridad === 'Alta').length;
  
  /**
   * eventosDescartados: Contador de contingencias menores que no supusieron un riesgo real
   * o fueron etiquetadas como falsas alarmas.
   */
  const eventosDescartados = alerts.filter(a => a.estado !== 'Activa' && a.prioridad !== 'Alta').length;

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-5 pt-12">
        
        {/* ENCABEZADO DE LA PANTALLA */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-primary">Registro de Actividad</Text>
          <Text className="text-secondary text-sm mt-1">Eventos de las últimas 24 horas</Text>
        </View>

        {/* ========================================================================
            SECCIÓN: Tarjetas de Resumen Estadístico
            ======================================================================== */}
        <View className="flex-row justify-between mb-8">
          {/* Tarjeta: Eventos Menores / Descartados */}
          <View className="bg-surface p-4 rounded-xl flex-1 mr-2 border border-gray-800">
            <View className="flex-row items-center mb-1">
              <Ionicons name="warning-outline" size={20} color="#FFC107" />
              <Text className="text-2xl font-bold text-primary ml-2 font-mono">{eventosDescartados}</Text>
            </View>
            <Text className="text-secondary text-xs">Eventos descartados</Text>
          </View>

          {/* Tarjeta: Amenazas Reales / Emergencias */}
          <View className="bg-surface p-4 rounded-xl flex-1 ml-2 border border-gray-800">
            <View className="flex-row items-center mb-1">
              <Ionicons name="shield-half-outline" size={20} color="#FF4C4C" />
              <Text className="text-2xl font-bold text-primary ml-2 font-mono">{alertasReales}</Text>
            </View>
            <Text className="text-secondary text-xs">Alertas reales</Text>
          </View>
        </View>

        {/* ========================================================================
            SECCIÓN: Línea de Tiempo / Historial Visual Analítico
            ======================================================================== */}
        {alerts.filter(a => a.estado !== 'Activa').map((evento) => {
          // Evaluación de criticidad para aplicar estilos e iconos condicionales
          const esCritico = evento.prioridad === 'Alta';
          const fechaObj = new Date(evento.timestamp);
          const horaFormateada = fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <View 
              key={evento.id_alerta} 
              className={`bg-surface p-5 rounded-xl mb-4 border ${esCritico ? 'border-critico/40' : 'border-gray-800'}`}
            >
              {/* Información Primaria del Evento (Hora y Zona) */}
              <View className="flex-row items-center mb-3">
                <Ionicons 
                  name={esCritico ? 'shield-half-outline' : 'shield-checkmark-outline'} 
                  size={20} 
                  color={esCritico ? '#FF4C4C' : '#FFC107'} 
                />
                <View className="ml-3 flex-1">
                  <Text className="text-primary font-bold font-mono text-base">{horaFormateada}</Text>
                  <Text className="text-primary text-sm font-medium">
                    {esCritico ? `Intrusión confirmada en ${evento.zona}` : `Movimiento en ${evento.zona}`}
                  </Text>
                </View>
              </View>

              {/* Bloque de Telemetría: Datos de Sensores de Hardware */}
              <View className="mb-4 pl-8">
                {/* Canal Sismológico: Geófono */}
                <Text className="text-secondary text-xs mb-1">
                  <Text className="text-gray-500">≈ Geófono: </Text>
                  <Text className="text-primary">{esCritico ? 'Pisadas detectadas' : 'Vibración detectada'}</Text>
                </Text>
                {/* Canal Volumétrico: Radar de Microondas */}
                <Text className="text-secondary text-xs">
                  <Text className="text-gray-500">((•)) Radar: </Text>
                  <Text className="text-primary">
                    {esCritico ? `Presencia confirmada (${evento.nivel_certeza}%)` : 'Sin presencia humana'}
                  </Text>
                </Text>
              </View>

              {/* Tag de Estado Operativo / Resolución Institucional */}
              <View className="items-start pl-8">
                <View className={`px-3 py-1.5 rounded-full border ${esCritico ? 'bg-critico/20 border-critico/50' : 'border-advertencia/50'}`}>
                  <Text className={`text-xs font-bold uppercase ${esCritico ? 'text-critico' : 'text-advertencia'}`}>
                    {esCritico ? 'ALERTA ENVIADA A CARABINEROS' : 'DESCARTADO (FALSA ALARMA)'}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* ========================================================================
          MODAL INTERACTIVO: Flujo Crítico de Intrusión Detectada
          ======================================================================== */}
      <Modal visible={!!activeAlert} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/90 justify-center px-6">
          <View className="bg-surface p-6 rounded-2xl border-2 border-critico shadow-2xl">
            
            {/* Cabecera del Reporte de Emergencia */}
            <View className="items-center mb-6">
              <Ionicons name="warning" size={64} color="#FF4C4C" />
              <Text className="text-critico text-2xl font-bold tracking-widest uppercase mt-2 text-center">¡Intrusión Detectada!</Text>
            </View>

            {/* Ficha Técnica del Punto de Infección/Brecha */}
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

            {/* Acciones de Despacho y Contención */}
            <View className="space-y-4">
              {/* Opción Destructiva / Afirmación de Incidente */}
              <TouchableOpacity 
                className="bg-critico py-4 rounded-xl items-center mb-4" 
                onPress={() => handleDecision(activeAlert!.id_alerta, 'Confirmar')}
              >
                <Text className="text-white font-bold text-lg uppercase tracking-wide">Confirmar Amenaza</Text>
              </TouchableOpacity>
              
              {/* Opción Preventiva / Mitigación de Falso Positivo */}
              <TouchableOpacity 
                className="bg-gray-700 py-4 rounded-xl items-center" 
                onPress={() => handleDecision(activeAlert!.id_alerta, 'Falsa Alarma')}
              >
                <Text className="text-primary font-bold text-lg uppercase tracking-wide">Falsa Alarma</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}