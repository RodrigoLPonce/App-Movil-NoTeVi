// ============================================================================
// IMPORTS: Métodos del SDK Core y Módulos de Firebase
// ============================================================================
import { initializeApp } from 'firebase/app';
// initializeApp: Inicializador del core del servicio que acopla las credenciales del cliente
import { getAuth } from 'firebase/auth';
// getAuth: Factory del gestor del ciclo de vida y tokens de autenticación de usuarios
import { getFirestore } from 'firebase/firestore';
// getFirestore: Factory del manejador de la base de datos NoSQL en tiempo real (Cloud Firestore)

// ============================================================================
// CONFIGURACIÓN: Credenciales del Proyecto de Firebase (Infraestructura en la Nube)
// ============================================================================
/**
 * Parámetros de conexión requeridos por Google Cloud para rutear y 
 * autorizar el tráfico de datos desde este cliente móvil hacia la nube.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDbbpMeoJGu3HVMGdLfHK8EQDJSnfjzNgA",
  authDomain: "notevi-app.firebaseapp.com",
  projectId: "notevi-app",
  storageBucket: "notevi-app.firebasestorage.app",
  messagingSenderId: "966824738576",
  appId: "1:966824738576:web:0b74ff6d95ff62b1a4ef95"
};
// ============================================================================
// INICIALIZACIÓN: Orquestador y Conectores de Servicios
// ============================================================================
/**
 * app: Instancia central de Firebase en memoria. Actúa como el puente 
 * unificado para compartir la configuración base entre todos los submódulos.
 */
const app = initializeApp(firebaseConfig);

/**
 * db: Instancia exportable de Cloud Firestore.
 * Utilizada en repositorios y managers para consultar, escribir y escuchar 
 * colecciones críticas (ej: logs de sensores, telemetría e incidencias).
 */
export const db = getFirestore(app);

/**
 * auth: Instancia exportable del servicio Firebase Auth.
 * Provee la lógica nativa subyacente para verificar tokens de operador, 
 * refrescar sesiones, cambiar claves y mantener persistencia local del perfil.
 */
export const auth = getAuth(app);