/*
import { Roboto_400Regular, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#121212' } }}>
      <Stack.Screen name="index" /> 
      <Stack.Screen name="(tabs)" /> 
    </Stack>
  );
}
*/

// ============================================================================
// IMPORTS: Fuentes y librerías
// ============================================================================
import { Roboto_400Regular, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
// Fuente Roboto: utilizada para textos generales (Regular 400 y Bold 700)
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
// Fuente Space Mono: monoespaciada (para IDs de nodos, códigos técnicos)
import { Stack } from 'expo-router';
// Stack: componente de navegación que maneja pantallas apiladas
import * as SplashScreen from 'expo-splash-screen';
// SplashScreen: control de la pantalla de carga (splash screen)
import { useEffect } from 'react';
// useEffect: hook para efectos secundarios (cargar fuentes, ocultar splash)
import '../global.css';
// Estilos globales de TailwindCSS

// ============================================================================
// CONSTANTES
// ============================================================================
// Prevenir que el splash screen se oculte automáticamente
// Esto permite esperar a que las fuentes se carguen completamente
SplashScreen.preventAutoHideAsync();

// ============================================================================
// COMPONENTE: RootLayout (Contenedor raíz de la aplicación)
// ============================================================================
/**
 * RootLayout es el contenedor raíz de toda la aplicación.
 * Responsabilidades:
 * - Cargar fuentes personalizadas (Roboto, Space Mono)
 * - Mostrar/ocultar splash screen mientras se cargan las fuentes
 * - Configurar la pila de navegación (Stack) raíz
 * - Definir las pantallas: login (index) y app principal (tabs)
 */
export default function RootLayout() {
  // ========================================================================
  // ESTADO: Carga de fuentes
  // ========================================================================
  /**
   * [loaded, error]: Boolean que indica si las fuentes se cargaron
   * - loaded: true cuando todas las fuentes están listas
   * - error: cualquier error durante la carga
   */
  const [loaded, error] = useFonts({
    Roboto_400Regular,    // Fuente regular para texto general
    Roboto_700Bold,       // Fuente bold para títulos y énfasis
    SpaceMono_400Regular, // Fuente monoespaciada para códigos/IDs técnicos
  });

  // ========================================================================
  // EFECTO: Ocultar splash screen cuando las fuentes estén listas
  // ========================================================================
  /**
   * Se ejecuta cuando 'loaded' o 'error' cambian.
   * Si las fuentes se cargaron (loaded=true) o hubo error,
   * ocultamos el splash screen.
   */
  useEffect(() => {
    if (loaded || error) {
      // Ocultar el splash screen de forma asincrónica
      SplashScreen.hideAsync();
    }
  }, [loaded, error]); // Dependencias: re-ejecutar si loaded o error cambian

  // ========================================================================
  // RENDERIZADO CONDICIONAL: Esperar a que las fuentes carguen
  // ========================================================================
  /**
   * Si las fuentes no han cargado y no hay error, retornar null
   * (no renderizar nada hasta que las fuentes estén listas)
   */
  if (!loaded && !error) {
    return null;
  }

  // ========================================================================
  // RETORNO: Estructura de navegación
  // ========================================================================
  /**
   * Stack: Contenedor de navegación que maneja 2 pantallas principales:
   * 1. "index" (login): Pantalla de autenticación
   * 2. "(tabs)" (app principal): Pantalla con navegación de pestañas
   */
  return (
    <Stack 
      screenOptions={{
        headerShown: false,                        // Ocultar header nativo
        contentStyle: { backgroundColor: '#121212' } // Fondo oscuro (#121212 = casi negro)
      }}
    >
      {/* Pantalla 1: Login (index.tsx) */}
      <Stack.Screen name="index" /> 
      {/* Pantalla 2: App principal con tabs (tabs/_layout.tsx) */}
      <Stack.Screen name="(tabs)" /> 
    </Stack>
  );
}