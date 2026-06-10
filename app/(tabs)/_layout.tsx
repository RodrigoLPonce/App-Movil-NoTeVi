// ============================================================================
// IMPORTS: Iconos y navegación con tabs
// ============================================================================
import { Ionicons } from '@expo/vector-icons';
// Ionicons: librería de iconos (pulse, shield, etc.)
import { Tabs } from 'expo-router';
// Tabs: componente de navegación por pestañas/tabs

// ============================================================================
// COMPONENTE: TabsLayout (Navegación por pestañas)
// ============================================================================
/**
 * Contenedor de navegación con pestañas (bottom tab bar).
 * Define 2 pantallas principales accesibles por tabs:
 * 1. Dashboard - Monitoreo del sistema en tiempo real
 * 2. Alerts - Historial y gestión de alertas
 * 
 * La barra de tabs aparece en la parte inferior de la pantalla
 * con iconos y títulos para cada pestaña.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        // ===== CONFIGURACIÓN GENERAL DE TABS =====
        headerShown: false,              // Ocultar header/cabecera nativa
        
        // ===== ESTILOS DE LA BARRA DE TABS =====
        tabBarStyle: {
          backgroundColor: '#1E1E1E',    // Color fondo: gris oscuro
          borderTopColor: '#2D2D2D',     // Color del borde superior: gris más claro
          height: 65,                    // Altura de la barra: 65px
          paddingBottom: 10,             // Espaciado interno inferior
          paddingTop: 10,                // Espaciado interno superior
        },
        
        // ===== COLORES DE TABS =====
        tabBarActiveTintColor: '#3B82F6',    // Color cuando está activo (azul)
        tabBarInactiveTintColor: '#A0A0A0',  // Color cuando está inactivo (gris)
      }}
    >
      {/* ===== TAB 1: DASHBOARD (MONITOREO) ===== */}
      <Tabs.Screen
        name="dashboard"  // Referencia a la carpeta/archivo dashboard.tsx
        options={{
          title: 'Monitoreo', // Texto que aparece en la barra
          
          // ===== ICONO DEL TAB =====
          /**
           * tabBarIcon es una función que recibe:
           * - color: color actual del ícono (basado en activo/inactivo)
           * - focused: boolean indicando si está activo
           */
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              // Mostrar ícono lleno si está enfocado, outline si no
              name={focused ? 'pulse' : 'pulse-outline'} 
              size={24}              // Tamaño del ícono
              color={color}          // Color (azul si activo, gris si inactivo)
            />
          ),
        }}
      />

      {/* ===== TAB 2: ALERTS (HISTORIAL DE ALERTAS) ===== */}
      <Tabs.Screen
        name="alerts"   // Referencia a la carpeta/archivo alerts.tsx
        options={{
          title: 'Alertas', // Texto que aparece en la barra
          
          // ===== ICONO DEL TAB =====
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              // Mostrar ícono lleno si está enfocado, outline si no
              name={focused ? 'shield' : 'shield-outline'} 
              size={24}              // Tamaño del ícono
              color={color}          // Color (azul si activo, gris si inactivo)
            />
          ),
        }}
      />
    </Tabs>
  );
}