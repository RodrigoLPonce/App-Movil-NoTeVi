// ============================================================================
// IMPORTS: Navegación y componentes UI
// ============================================================================
import { router } from 'expo-router';
// router: permite navegar entre pantallas de forma programática
import { useState } from 'react';
// useState: hook para manejar estado local (credenciales)
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Componentes nativos de React Native:
// - Alert: diálogos de alerta
// - Text: renderizar texto
// - TextInput: campo de entrada de texto
// - TouchableOpacity: botón/elemento clickeable
// - View: contenedor (div equivalente)

// ============================================================================
// COMPONENTE: LoginScreen (Pantalla de autenticación)
// ============================================================================
/**
 * Pantalla de login/autenticación de la aplicación NoTeVi.
 * Permite al operador ingresar sus credenciales:
 * - ID de Operador (usuario)
 * - Código de Acceso (contraseña)
 * 
 * Credenciales válidas (por defecto):
 * - Usuario: "guardia"
 * - Contraseña: "1234"
 * 
 * Flujo:
 * 1. Usuario ingresa credenciales
 * 2. Click en "Iniciar Sesión"
 * 3. Si son válidas → navega a /(tabs)/dashboard
 * 4. Si son inválidas → muestra alerta de error
 */
export default function LoginScreen() {
  // ========================================================================
  // ESTADOS: Campos del formulario
  // ========================================================================
  /**
   * username: ID/nombre de usuario
   * setUsername: función para actualizar el usuario
   */
  const [username, setUsername] = useState('');
  
  /**
   * password: contraseña/código de acceso
   * setPassword: función para actualizar la contraseña
   */
  const [password, setPassword] = useState('');

  // ========================================================================
  // FUNCIÓN: handleLogin (Validación y navegación)
  // ========================================================================
  /**
   * Se ejecuta cuando el usuario presiona "Iniciar Sesión"
   * Pasos:
   * 1. Normaliza el usuario (minúsculas, sin espacios)
   * 2. Valida contra credenciales hardcodeadas
   * 3. Si es válido: navega al dashboard
   * 4. Si es inválido: muestra alerta de error
   */
  const handleLogin = () => {
    // Normalizar entrada: convertir a minúsculas y remover espacios
    const user = username.toLowerCase().trim();
    
    // Validación: comparar contra credenciales
    if (user === 'guardia' && password === '1234') {
      // ✅ Acceso concedido
      // router.replace() reemplaza la pantalla actual (no permite volver)
      router.replace('/(tabs)/dashboard');
    } else {
      // ❌ Acceso denegado
      // Alert.alert(título, descripción)
      Alert.alert('Acceso Denegado', 'Credenciales inválidas.');
    }
  };

  // ========================================================================
  // RETORNO: UI del formulario de login
  // ========================================================================
  return (
    // Contenedor principal (flex-1 = ocupa todo el espacio disponible)
    <View className="flex-1 justify-center px-8 bg-background">
      {/* ===== SECCIÓN 1: CABECERA (Logo + Título) ===== */}
      <View className="mb-12">
        {/* Logo de la aplicación */}
        <Text className="text-5xl font-bold text-primary mb-2">
          NoTeVi
        </Text>
        {/* Subtítulo con línea de borde izquierdo */}
        <Text className="text-secondary text-base border-l-2 border-action pl-3">
          Módulo de Monitoreo Activo
        </Text>
      </View>

      {/* ===== SECCIÓN 2: FORMULARIO DE CREDENCIALES ===== */}
      <View className="bg-surface p-6 rounded-xl border border-gray-800">
        
        {/* CAMPO 1: ID de Operador (Usuario) */}
        <TextInput
          className="bg-background text-primary px-4 py-4 rounded-lg mb-4 border border-gray-700"
          placeholder="ID de Operador"          // Texto de ayuda
          placeholderTextColor="#A0A0A0"        // Color del placeholder (gris)
          autoCapitalize="none"                 // No capitalizar automaticamente
          value={username}                       // Valor vinculado al estado
          onChangeText={setUsername}             // Actualizar estado cuando cambia
        />
        
        {/* CAMPO 2: Código de Acceso (Contraseña) */}
        <TextInput
          className="bg-background text-primary px-4 py-4 rounded-lg mb-8 border border-gray-700"
          placeholder="Código de Acceso"        // Texto de ayuda
          placeholderTextColor="#A0A0A0"        // Color del placeholder
          secureTextEntry                        // Ocultar caracteres (puntos)
          value={password}                       // Valor vinculado al estado
          onChangeText={setPassword}             // Actualizar estado cuando cambia
        />
        
        {/* BOTÓN: Iniciar Sesión */}
        <TouchableOpacity 
          className="bg-action py-4 rounded-lg items-center" 
          onPress={handleLogin}                  // Ejecutar handleLogin al presionar
        >
          <Text className="text-primary font-bold text-lg uppercase">
            Iniciar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}