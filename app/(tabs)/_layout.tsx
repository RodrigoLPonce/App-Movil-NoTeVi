// ============================================================================
// IMPORTS: Iconos de Ionicons y enrutador basado en tabs de Expo
// ============================================================================
import { Ionicons } from '@expo/vector-icons';
// Ionicons: biblioteca de iconos vectoriales para las pestañas de navegación
import { Tabs } from 'expo-router';
// Tabs: componente contenedor nativo para estructurar la navegación por pestañas

// ============================================================================
// COMPONENTE: TabLayout (Estructura de navegación inferior de la app)
// ============================================================================
/**
 * Layout de Navegación por Pestañas (Tab Navigation).
 * Responsabilidades:
 * 1. Definir la barra de navegación inferior (Tab Bar) fija.
 * 2. Aplicar estilos visuales unificados en modo oscuro (Dark Mode).
 * 3. Declarar la jerarquía, orden y enrutamiento de las pantallas principales.
 * 4. Asignar iconos dinámicos y estados de color activos/inactivos para cada sección.
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // ========================================================================
        // OPCIONES GLOBALES DE PANTALLA: Estilos y comportamiento de la barra
        // ========================================================================
        
        /**
         * headerShown: false
         * Oculta la cabecera superior nativa por defecto en todas las pantallas.
         * Permite que cada vista renderice e implemente su propio header personalizado.
         */
        headerShown: false,
        
        /**
         * tabBarStyle: configuración estética del contenedor de la barra de pestañas.
         * - backgroundColor: Fondo ultra oscuro para consistencia de interfaz táctica.
         * - borderTopColor: Línea divisoria superior sutil para evitar contrastes agresivos.
         * - padding/height: Dimensiones ergonómicas óptimas para interacción táctil.
         */
        tabBarStyle: {
          backgroundColor: '#0D1117', // Color de fondo oscuro (bg-background)
          borderTopColor: '#1F2937',  // Borde sutil gris oscuro
          paddingBottom: 5,           // Espaciado inferior para los textos
          paddingTop: 5,              // Espaciado superior para los iconos
          height: 60,                 // Altura fija de la barra de pestañas
        },
        
        /**
         * Colores de los elementos interactivos basados en el estado de selección
         * - tabBarActiveTintColor: Tono de realce operativo cuando la pestaña está abierta.
         * - tabBarInactiveTintColor: Tono neutral/atenuado para pantallas en segundo plano.
         */
        tabBarActiveTintColor: '#00E676',   // Verde operativo (Alerta / Activo)
        tabBarInactiveTintColor: '#A0A0A0', // Gris claro (Inactivo / Reposo)
      }}
    >
      
      {/* ========================================================================
          PESTAÑA 1: Dashboard / Monitoreo
          ======================================================================== */}
      /**
       * name: "dashboard" -> mapea directamente al archivo /dashboard/index o /dashboard.tsx
       * title: Texto descriptivo visible en la barra inferior
       * tabBarIcon: Retorna un icono de pulso cardiaco/frecuencia simulando telemetría en vivo
       */
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Monitoreo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pulse" size={size} color={color} />
          ),
        }}
      />

      {/* ========================================================================
          PESTAÑA 2: Centro de Alertas de Intrusión
          ======================================================================== */}
      /**
       * name: "alerts" -> mapea al archivo /alerts.tsx (Historial y modales críticos)
       * title: Etiqueta del sistema de incidencias
       * tabBarIcon: Icono de escudo de seguridad perimetral segmentado
       */
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-half-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ========================================================================
          PESTAÑA 3: Configuración de Sensores
          ======================================================================== */}
      /**
       * name: "settings" -> mapea al archivo /settings.tsx
       * title: Panel de control de hardware/zonas
       * tabBarIcon: Icono de controles deslizantes de ajuste de parámetros o umbrales
       */
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Sensores',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="options-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ========================================================================
          PESTAÑA 4: Perfil de Usuario e Identidad
          ======================================================================== */}
      /**
       * name: "profile" -> mapea al archivo /profile.tsx al final de la barra
       * title: Cuenta del operador / credenciales del sistema
       * tabBarIcon: Icono de silueta de usuario clásico en formato outline
       */
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
}