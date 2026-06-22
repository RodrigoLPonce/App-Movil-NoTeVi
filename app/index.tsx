// ============================================================================
// IMPORTS: Iconos vectoriales, enrutador, Firebase Auth, hooks y componentes UI
// ============================================================================
import { Ionicons } from '@expo/vector-icons';
// Iconos vectoriales para representar de forma visual advertencias en el formulario
import { router } from 'expo-router';
// Enrutador de Expo para realizar el salto forzado y limpio hacia el Dashboard principal
import { signInWithEmailAndPassword } from 'firebase/auth';
// SDK de Firebase para procesar el login asíncrono basado en correo/contraseña
import { useState } from 'react';
// Hook para mutar el estado local de los buffers de entrada y mensajes de excepción
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Componentes estructurales y de interfaz nativa para la composición de la vista
import { auth } from '../config/firebase';
// Configuración de la instancia de autenticación de Firebase, importada desde el módulo de configuración

// ============================================================================
// COMPONENTE: LoginScreen (Pasarela de Autenticación y Control de Acceso)
// ============================================================================
/**
 * Pantalla de control de acceso para el personal y operadores de seguridad.
 * Responsabilidades:
 * 1. Capturar las credenciales de entrada mediante campos sanitizados.
 * 2. Validar formalmente la presencia de datos antes de disparar peticiones de red.
 * 3. Gestionar el túnel de autenticación contra la instancia oficial de Firebase Auth.
 * 4. Interceptar excepciones y renderizar banners inline condicionales para evitar alertas nativas.
 */
export default function LoginScreen() {
  // ========================================================================
  // ESTADOS LOCALES: Captura de credenciales y manejo de excepciones
  // ========================================================================
  /**
   * email: Almacena la cadena de texto del correo electrónico institucional.
   */
  const [email, setEmail] = useState('');

  /**
   * password: Almacena de forma enmascarada la clave de acceso del operador.
   */
  const [password, setPassword] = useState('');
  
  /**
   * errorMessage: Guarda los strings descriptivos de fallos de validación o red.
   * Si está vacío, el banner de alerta crítico permanece desmontado de la vista.
   */
  const [errorMessage, setErrorMessage] = useState('');

  // ========================================================================
  // FUNCIÓN: handleLogin (Despacho y validación de autenticación)
  // ========================================================================
  /**
   * Procesa el intento de login en el sistema perimetral.
   * Flujo de ejecución:
   * 1. Limpiar proactivamente cualquier mensaje de error de un intento fallido previo.
   * 2. Aplicar un recorte de espacios (.trim()) y evaluar que los campos no estén vacíos.
   * 3. Invocar la pasarela remota de Firebase de manera asíncrona.
   * 4. Al recibir respuesta satisfactoria, redirigir al Dashboard de monitoreo activo usando .replace() 
   * para limpiar el historial de navegación hacia atrás.
   * 5. En caso de falla, capturar el error en consola e informar al usuario en la UI.
   */
  const handleLogin = async () => {
    // 1. Reset preventivo de estados de error
    setErrorMessage('');

    // 2. Control de campos vacíos (Sanitización básica en cliente)
    if (!email.trim() || !password) {
      setErrorMessage('Por favor, ingresa correo y contraseña.');
      return;
    }

    // 3. Intento de Handshake / Inicio de sesión con el Backend de Firebase
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      
      // Enrutamiento absoluto hacia la interfaz de control principal
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      console.error(error);
      
      // 4. Captura adaptativa de excepciones de credenciales o red
      setErrorMessage('Credenciales inválidas. Verifica tu correo o contraseña.');
    }
  };

  return (
    <View className="flex-1 justify-center px-8 bg-background">
      
      {/* ========================================================================
          SECCIÓN: Logotipo Institucional y Encabezado de la División
          ======================================================================== */}
      <View className="mb-12 items-center">
        <Image 
          source={require('../assets/images/logo_white1.png')} 
          style={{ width: 220, height: 220, marginBottom: 10 }}
          resizeMode="contain"
        />
        <Text className="text-secondary text-lg font-medium tracking-wide text-center uppercase">
          Módulo de Monitoreo Activo
        </Text>
      </View>

      {/* ========================================================================
          SECCIÓN: Formulario y Acciones Operativas de Entrada
          ======================================================================== */}
      <View className="bg-surface p-6 rounded-xl border border-gray-800">
        
        {/* RENDERIZADO CONDICIONAL: Banner de Alerta Crítica Inline */}
        {errorMessage ? (
          <View className="bg-critico/10 border border-critico/50 p-3 rounded-lg mb-4 flex-row items-center">
            <Ionicons name="warning-outline" size={20} color="#FF4C4C" className="mr-2" />
            <Text className="text-critico text-sm font-medium flex-1">{errorMessage}</Text>
          </View>
        ) : null}

        {/* Input 1: Canal de Correo Electrónico */}
        <TextInput
          className="bg-background text-primary px-4 py-4 rounded-lg mb-4 border border-gray-700"
          placeholder="Correo Electrónico"
          placeholderTextColor="#A0A0A0"
          autoCapitalize="none" // Previene autocorrección molesta en correos
          keyboardType="email-address" // Despliega el teclado nativo con el carácter '@' directo
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMessage(''); // Borra el aviso de error de forma dinámica para mejorar UX
          }}
        />
        
        {/* Input 2: Canal de Contraseña Segura */}
        <TextInput
          className="bg-background text-primary px-4 py-4 rounded-lg mb-8 border border-gray-700"
          placeholder="Contraseña de Acceso"
          placeholderTextColor="#A0A0A0"
          secureTextEntry // Enmascara los caracteres ingresados
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage(''); // Borra el aviso de error de forma dinámica al interactuar
          }}
        />
        
        {/* Botón Ejecutor de Autenticación */}
        <TouchableOpacity className="bg-action py-4 rounded-lg items-center" onPress={handleLogin}>
          <Text className="text-primary font-bold text-lg uppercase">Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}