// ============================================================================
// IMPORTS: Iconos vectoriales, enrutador, Firebase Auth, hooks y componentes UI
// ============================================================================
import { Ionicons } from '@expo/vector-icons';
// Iconos vectoriales para representar acciones de seguridad, perfil e interfaz de usuario
import { router } from 'expo-router';
// Enrutador basado en archivos para transiciones drásticas de navegación (Ej: Login)
import { updatePassword } from 'firebase/auth';
// Servicio modular de Firebase para actualizar de forma segura las credenciales del operador
import { useState } from 'react';
// Hook de React para la mutación y lectura de estados locales en tiempo de ejecución
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Componentes estructurales nativos para la composición visual interactiva en Android/iOS
import { auth } from '../../config/firebase';
// Instancia configurada de autenticación de Firebase vinculada a la app perimetral

// ============================================================================
// COMPONENTE: ProfileScreen (Gestión de Identidad y Sesión del Operador)
// ============================================================================
/**
 * Pantalla de administración del perfil táctico del operador.
 * Responsabilidades:
 * 1. Desplegar la ficha de identidad del usuario actual logueado en la nube.
 * 2. Mostrar estadísticas simuladas de rendimiento (Eventos atendidos y horas de turno).
 * 3. Proveer un flujo seguro de cambio de clave enlazado directamente con Firebase Auth.
 * 4. Gestionar la desconexión total del sistema de alertas mediante el cierre de sesión.
 */
export default function ProfileScreen() {
  // ========================================================================
  // ESTADOS: Control del flujo de Cierre de Sesión (Logout)
  // ========================================================================
  /**
   * logoutModalVisible: Flag booleano para mostrar/ocultar el modal de advertencia de desconexión.
   */
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  /**
   * userEmail: Extrae dinámicamente el correo electrónico del operador activo desde Firebase.
   * Si no hay sesión válida, aplica un valor fallback de contingencia.
   */
  const userEmail = auth.currentUser?.email || 'operador@desconocido.com';

  // ========================================================================
  // ESTADOS: Control del flujo de Actualización de Contraseña
  // ========================================================================
  /**
   * pwdModalVisible: Flag booleano para conmutar la visibilidad del formulario de nueva clave.
   */
  const [pwdModalVisible, setPwdModalVisible] = useState(false);

  /**
   * newPassword: Almacena el buffer de texto plano ingresado en el input de la contraseña.
   */
  const [newPassword, setNewPassword] = useState('');

  /**
   * pwdMessage: Cadena de texto informativa para renderizar alertas de error o estados de éxito.
   */
  const [pwdMessage, setPwdMessage] = useState('');

  /**
   * isSuccess: Conmutador de estilos para formatear el mensaje en rojo (error) o verde (operativo).
   */
  const [isSuccess, setIsSuccess] = useState(false);

  // ========================================================================
  // FUNCIÓN: executeLogout (Desconexión de la pasarela de autenticación)
  // ========================================================================
  /**
   * Destruye el token de sesión activo del cliente en Firebase.
   * Pasos:
   * 1. Invocar el método de desconexión asíncrono signOut().
   * 2. Ocultar el diálogo de confirmación visual.
   * 3. Redirigir de forma absoluta a la raíz de la app (generalmente la pantalla de Login).
   */
  const executeLogout = async () => {
    // 1. Invalidación del token de sesión en la nube
    await auth.signOut();
    
    // 2. Cierre del modal reactivo
    setLogoutModalVisible(false);
    
    // 3. Reset total del árbol de navegación para forzar re-autenticación
    router.replace('/'); 
  };

  // ========================================================================
  // FUNCIÓN: executePasswordChange (Mutación de credenciales en la nube)
  // ========================================================================
  /**
   * Evalúa, valida y despacha la nueva contraseña hacia el servidor de Firebase.
   * Pasos:
   * 1. Resetear el buffer de mensajes informativos anteriores.
   * 2. Validar que la cadena cumpla con el estándar mínimo de la infraestructura de Firebase (>= 6 caracteres).
   * 3. Verificar la presencia del puntero del usuario autenticado en caliente.
   * 4. Despachar la petición y gestionar el éxito con un temporizador automático para cerrar el diálogo.
   * 5. Capturar excepciones de seguridad críticas (Ej: Solicitud de re-autenticación por sesión vieja).
   */
  const executePasswordChange = async () => {
    // 1. Limpieza de buffers preventivo
    setPwdMessage('');
    
    // 2. Validación estricta de longitud de caracteres
    if (newPassword.length < 6) {
      setPwdMessage('La contraseña debe tener al menos 6 caracteres.');
      setIsSuccess(false);
      return;
    }

    try {
      // 3. Comprobación de integridad del nodo de usuario
      if (auth.currentUser) {
        // Despacho asíncrono a los servidores de Firebase Auth
        await updatePassword(auth.currentUser, newPassword);
        
        // 4. Procesamiento de resolución exitosa
        setPwdMessage('¡Contraseña actualizada en la nube!');
        setIsSuccess(true);
        setNewPassword('');
        
        // Cierre temporizado para permitir al operador leer la confirmación operativa
        setTimeout(() => {
          setPwdModalVisible(false);
          setPwdMessage('');
        }, 2000);
      }
    } catch (error: any) {
      console.error(error);
      setIsSuccess(false);
      
      // 5. Manejo de excepciones controlado por políticas de seguridad de Firebase
      if (error.code === 'auth/requires-recent-login') {
        setPwdMessage('Por seguridad, cierra sesión y vuelve a entrar para hacer esto.');
      } else {
        setPwdMessage('Error de conexión al actualizar.');
      }
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-5 pt-12">
        
        {/* ENCABEZADO PRINCIPAL DE LA VISTA */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-primary">Perfil de Operador</Text>
          <Text className="text-secondary text-sm mt-1">Administración de cuenta y sesión</Text>
        </View>

        {/* ========================================================================
            SECCIÓN: Tarjeta Informativa de Sesión e Identidad
            ======================================================================== */}
        <View className="bg-surface rounded-xl border border-gray-800 p-5 mb-6 flex-row items-center">
          {/* Contenedor del Avatar / Icono Representativo */}
          <View className="w-16 h-16 bg-gray-800 rounded-full items-center justify-center border border-gray-600 mr-4">
            <Ionicons name="person" size={32} color="#00E676" />
          </View>
          {/* Metadatos del Rol de Seguridad */}
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="text-primary font-bold text-lg mr-2">Sesión Activa</Text>
              <View className="bg-operativo/20 px-2 py-0.5 rounded border border-operativo/50">
                <Text className="text-operativo text-[10px] font-bold uppercase">Admin</Text>
              </View>
            </View>
            <Text className="text-secondary text-sm font-mono mb-1">{userEmail}</Text>
            <Text className="text-gray-500 text-xs">División de Seguridad NoTeVi</Text>
          </View>
        </View>

        {/* ========================================================================
            SECCIÓN: Estadísticas del Turno (Métricas de Desempeño Operativo)
            ======================================================================== */}
        <View className="flex-row justify-between mb-8">
          {/* Métrica 1: Eventos Procesados */}
          <View className="bg-surface p-4 rounded-xl flex-1 mr-2 border border-gray-800 items-center">
            <Ionicons name="shield-checkmark-outline" size={24} color="#00E676" className="mb-2" />
            <Text className="text-2xl font-bold text-primary font-mono">12</Text>
            <Text className="text-secondary text-xs text-center mt-1">Eventos Atendidos</Text>
          </View>
          
          {/* Métrica 2: Tiempo de Guardia Activo */}
          <View className="bg-surface p-4 rounded-xl flex-1 ml-2 border border-gray-800 items-center">
            <Ionicons name="time-outline" size={24} color="#3B82F6" className="mb-2" />
            <Text className="text-2xl font-bold text-primary font-mono">04:30</Text>
            <Text className="text-secondary text-xs text-center mt-1">Horas en Turno</Text>
          </View>
        </View>

        {/* ========================================================================
            SECCIÓN: Menú de Configuración / Ajustes del Sistema y Seguridad
            ======================================================================== */}
        <Text className="text-primary font-bold text-sm mb-3 ml-1 uppercase tracking-wider">Ajustes de Seguridad</Text>
        <View className="bg-surface rounded-xl border border-gray-800 p-2 mb-6">
          
          {/* Enlace de Control 1: Cambio de Contraseña */}
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 border-b border-gray-800"
            onPress={() => {
              setPwdMessage('');
              setNewPassword('');
              setPwdModalVisible(true); // Abre el flujo del formulario modal
            }}
          >
            <View className="flex-row items-center">
              <View className="bg-gray-800 p-2 rounded-lg mr-3">
                <Ionicons name="key-outline" size={20} color="#E0E0E0" />
              </View>
              <Text className="text-primary text-base font-medium">Cambiar Contraseña</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          {/* Enlace de Control 2: Token Métrico / Huella Digital */}
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-800">
            <View className="flex-row items-center">
              <View className="bg-gray-800 p-2 rounded-lg mr-3">
                <Ionicons name="finger-print-outline" size={20} color="#E0E0E0" />
              </View>
              <Text className="text-primary text-base font-medium">Datos Biométricos</Text>
            </View>
            <Text className="text-operativo text-xs font-bold uppercase mr-2">Vinculado</Text>
          </TouchableOpacity>

          {/* Enlace de Control 3: Estado del Servidor Central */}
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <View className="bg-gray-800 p-2 rounded-lg mr-3">
                <Ionicons name="cloud-done-outline" size={20} color="#E0E0E0" />
              </View>
              <Text className="text-primary text-base font-medium">Servidor Backend</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-operativo mr-2" />
              <Text className="text-operativo text-xs font-bold uppercase">En Línea</Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* ========================================================================
            ACCION CENTRAL DE TERMINACIÓN: Botón de Cierre de Sesión Destructivo
            ======================================================================== */}
        <TouchableOpacity 
          className="bg-surface rounded-xl border border-critico/30 p-4 flex-row items-center justify-center mt-2"
          onPress={() => setLogoutModalVisible(true)}
        >
          <Ionicons name="log-out-outline" size={22} color="#FF4C4C" className="mr-2" />
          <Text className="text-critico font-bold text-lg uppercase tracking-wider">Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* Pie de página con información del despliegue en contenedores */}
        <Text className="text-center text-gray-600 text-xs mt-8 mb-10">
          NoTeVi v1.0.0 (Build 42) - Docker Containerized
        </Text>
      </ScrollView>

      {/* ========================================================================
          MODAL 1: Confirmación de Cierre de Sesión
          ======================================================================== */}
      <Modal visible={logoutModalVisible} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/90 justify-center px-6">
          <View className="bg-surface p-6 rounded-2xl border border-gray-700 shadow-2xl">
            
            {/* Cabecera del Mensaje de Alerta */}
            <View className="items-center mb-4">
              <Ionicons name="log-out" size={56} color="#FF4C4C" />
              <Text className="text-primary text-xl font-bold tracking-widest uppercase mt-4 text-center">Cerrar Sesión</Text>
            </View>
            
            {/* Cuerpo del Diálogo */}
            <Text className="text-secondary text-center mb-8">
              ¿Estás seguro que deseas desconectarte del módulo de monitoreo? Dejarás de recibir alertas en tiempo real.
            </Text>
            
            {/* Botones de Confirmación y Aborto */}
            <View className="space-y-4">
              <TouchableOpacity className="bg-critico py-4 rounded-xl items-center mb-3" onPress={executeLogout}>
                <Text className="text-white font-bold text-lg uppercase tracking-wide">Sí, Salir</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-gray-800 py-4 rounded-xl items-center border border-gray-700" 
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text className="text-primary font-bold text-lg uppercase tracking-wide">Cancelar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* ========================================================================
          MODAL 2: Formulario de Mutación de Contraseña (Firebase Auth Sync)
          ======================================================================== */}
      <Modal visible={pwdModalVisible} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/90 justify-center px-6">
          <View className="bg-surface p-6 rounded-2xl border border-gray-700 shadow-2xl">
            
            {/* Encabezado del Formulario Secundario */}
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-gray-800 rounded-full items-center justify-center border border-gray-600 mb-2">
                <Ionicons name="key" size={32} color="#00E676" />
              </View>
              <Text className="text-primary text-xl font-bold tracking-widest uppercase mt-2 text-center">Nueva Contraseña</Text>
            </View>

            <Text className="text-secondary text-center text-sm mb-6">
              Ingresa la nueva clave para tu cuenta de operador. Mínimo 6 caracteres.
            </Text>

            {/* Input del password con ocultamiento de caracteres nativo (secureTextEntry) */}
            <TextInput
              className="bg-background text-primary px-4 py-4 rounded-lg mb-2 border border-gray-700"
              placeholder="Escribe la nueva contraseña"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setPwdMessage(''); // Ocultamiento dinámico de errores en caliente al escribir
              }}
            />

            {/* Renderizado Condicional: Alertas informativas de la API de Firebase */}
            {pwdMessage ? (
              <Text className={`text-center text-xs mb-4 font-bold ${isSuccess ? 'text-operativo' : 'text-critico'}`}>
                {pwdMessage}
              </Text>
            ) : (
              <View className="h-4 mb-4" /> // Bloque contenedor estructural estable para evitar saltos en la UI
            )}

            {/* Acciones del Formulario */}
            <View className="space-y-4">
              {/* Botón ejecutor asíncrono */}
              <TouchableOpacity className="bg-action py-4 rounded-xl items-center mb-3" onPress={executePasswordChange}>
                <Text className="text-primary font-bold text-lg uppercase tracking-wide">Actualizar</Text>
              </TouchableOpacity>
              
              {/* Abortar e ignorar cambios */}
              <TouchableOpacity 
                className="bg-gray-800 py-4 rounded-xl items-center border border-gray-700" 
                onPress={() => setPwdModalVisible(false)}
              >
                <Text className="text-primary font-bold text-lg uppercase tracking-wide">Cancelar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}