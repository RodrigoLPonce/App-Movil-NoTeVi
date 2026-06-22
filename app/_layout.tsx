// ============================================================================
// IMPORTS: Fuentes tipográficas, enrutador Stack, pantalla de carga y estilos
// ============================================================================
import { Roboto_400Regular, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
// Fuentes de Google: Variaciones regular y negrita de Roboto para la UI general
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
// Fuente Monoespaciada: Orientada al renderizado de telemetría, marcas de tiempo y hashes
import { Stack } from 'expo-router';
// Stack: Componente contenedor nativo para la navegación basada en pilas (tarjetas superpuestas)
import * as SplashScreen from 'expo-splash-screen';
// SplashScreen: API nativa para controlar la persistencia de la pantalla de carga inicial de la app
import { useEffect } from 'react';
// useEffect: Hook para coordinar la sincronización del ciclo de vida y ocultar el Splash
import '../global.css';
// global.css: Inyección de estilos globales basados en NativeWind (Tailwind CSS)

// ============================================================================
// CONFIGURACIÓN INICIAL: Retención forzada de la Splash Screen
// ============================================================================
/**
 * SplashScreen.preventAutoHideAsync()
 * Previene que el sistema operativo oculte la pantalla de carga de manera automática.
 * Bloquea la UI en el Splash inicial hasta que los recursos críticos (fuentes) estén listos.
 */
SplashScreen.preventAutoHideAsync();

// ============================================================================
// COMPONENTE: RootLayout (Nodo Raíz de la Aplicación NoTeVi)
// ============================================================================
/**
 * Layout Principal de la App (Root Entry Point).
 * Responsabilidades:
 * 1. Cargar asíncronamente las fuentes tipográficas necesarias para la interfaz táctica.
 * 2. Gestionar el ciclo de vida de la pantalla de carga nativa (Splash Screen).
 * 3. Configurar el enrutador Stack global y aplicar el color de fondo base de la app.
 * 4. Declarar las rutas de acceso primarias: Pantalla de Acceso (index) y Sistema (tabs).
 */
export default function RootLayout() {
  // ========================================================================
  // HOOKS: Carga asíncrona de recursos tipográficos de Google
  // ========================================================================
  /**
   * useFonts: Hook que descarga o extrae de memoria las fuentes tipográficas.
   * Retorna un arreglo con dos flags posicionales: [loaded, error].
   */
  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    SpaceMono_400Regular,
  });

  // ========================================================================
  // EFECTO: Control de visibilidad de la Splash Screen nativa
  // ========================================================================
  /**
   * Monitoriza el estado de las fuentes. Cuando concluye la carga con éxito o
   * si se levanta un error crítico de lectura, libera el hilo visual ocultando el Splash.
   */
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync(); // Oculta la pantalla de carga de forma segura y fluida
    }
  }, [loaded, error]); // Se dispara únicamente cuando muta el estado de los recursos

  // ========================================================================
  // CONTROL DE RENDERIZADO: Cortafuegos de UI preliminar
  // ========================================================================
  /**
   * Mientras los recursos no estén disponibles en el hilo nativo y no exista error,
   * se retorna null para evitar destellos visuales (FOUC) o fallos de renderizado en la UI.
   */
  if (!loaded && !error) {
    return null;
  }

  return (
    /**
     * Stack: Enrutador global de tipo pila.
     * screenOptions globales:
     * - headerShown: false -> Desactiva las cabeceras nativas por defecto en la raíz.
     * - contentStyle: Define un fondo oscuro absoluto (#121212) para homogeneizar las transiciones.
     */
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#121212' } }}>
      
      {/* ========================================================================
          RUTA INTERNA 1: index (Acceso / Autenticación de Operador)
          ======================================================================== */}
      /**
       * Mapea directamente al archivo raíz /index.tsx. Es la puerta de entrada de la app
       * encargada del Login institucional de Firebase.
       */
      <Stack.Screen name="index" /> 

      {/* ========================================================================
          RUTA INTERNA 2: (tabs) (Contenedor de Navegación del Sistema)
          ======================================================================== */}
      /**
       * Mapea al subdirectorio /(tabs)/_layout.tsx. Agrupa el espacio de trabajo protegido,
       * encapsulando el Monitoreo, Alertas, Sensores y Perfil bajo una barra de pestañas.
       */
      <Stack.Screen name="(tabs)" /> 
      
    </Stack>
  );
}