// ============================================================================
// IMPORTS: Operaciones atómicas y de consulta de Cloud Firestore SDK
// ============================================================================
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
// SDK Modular: Métodos estructurados para mutaciones (CUD) y consultas ordenadas (R) en Firestore
import { db } from '../config/firebase';
// db: Instancia central configurada de la base de datos NoSQL del ecosistema NoTeVi

// ============================================================================
// INTERFAZ DE DATOS: AlertData (Contrato Estructural del Objeto de Alerta)
// ============================================================================
/**
 * Define la tipación estricta de una alerta dentro del flujo del sistema.
 */
export interface AlertData {
  id_alerta: string;       // Identificador único (ID del documento generado por Firestore)
  id_sensor: string;       // Código de hardware del nodo emisor (Ej: SENS-PERIM-04)
  zona: string;            // Segmento geográfico del despliegue perimetral
  nivel_certeza: number;   // Porcentaje algorítmico de fiabilidad (Fusión de sensores)
  timestamp: string;       // Marca de tiempo en formato estandarizado ISO 8601
  prioridad: 'Alta' | 'Media' | 'Baja';                 // Nivel de criticidad táctica
  estado: 'Activa' | 'En Verificación' | 'Resuelta/Cerrada'; // Ciclo de vida del evento
}

// Nombre de la colección raíz en la base de datos documental
const ALERTS_COLLECTION = 'alertas';

// ============================================================================
// CLASE: StorageManager (Servicio de Persistencia y Comunicación Remota)
// ============================================================================
/**
 * Capa de abstracción de datos (DAL) encargada de la persistencia de alertas.
 * Transfiere, muta y limpia los registros del feed perimetral directamente
 * contra las colecciones remotas de Cloud Firestore.
 */
export class StorageManager {
  
  // ========================================================================
  // MÉTODO: getAlerts (Lectura del Historial Crítico)
  // ========================================================================
  /**
   * Obtiene la lista completa de alertas ordenadas cronológicamente.
   * Flujo lógico:
   * 1. Construir una query filtrada ordenando por `timestamp` de forma descendente.
   * 2. Descargar el snapshot documental desde la nube de manera asíncrona.
   * 3. Iterar los documentos y mapear el payload plano al tipado estricto `AlertData`.
   * @returns Promesa que resuelve a un arreglo estructurado de alertas (`AlertData[]`).
   */
  static async getAlerts(): Promise<AlertData[]> {
    try {
      // 1. Preparación de la consulta indexada cronológicamente
      const q = query(collection(db, ALERTS_COLLECTION), orderBy('timestamp', 'desc'));
      
      // 2. Ejecución asíncrona de la petición de red
      const querySnapshot = await getDocs(q);
      
      const alerts: AlertData[] = [];
      
      // 3. Mapeo y tipado de los datos crudos del documento NoSQL
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        alerts.push({
          id_alerta: doc.id, // Inyección del ID nativo del documento de Firestore
          id_sensor: data.id_sensor,
          zona: data.zona,
          nivel_certeza: data.nivel_certeza,
          timestamp: data.timestamp,
          prioridad: data.prioridad,
          estado: data.estado,
        });
      });
      return alerts;
    } catch (e) {
      console.error("Error leyendo alertas de Firebase:", e);
      return []; // Fallback seguro: retorna un array vacío ante fallas de conectividad o permisos
    }
  }

  // ========================================================================
  // MÉTODO: injectMockAlert (Inyector del Simulador / Easter Egg)
  // ========================================================================
  /**
   * Inyecta una alerta simulada de alta prioridad en la nube para pruebas de estrés de UI.
   * Invocado principalmente por la secuencia oculta de toques del Dashboard.
   * @returns Promesa con el objeto `AlertData` completamente estructurado y persistido.
   */
  static async injectMockAlert(): Promise<AlertData> {
    // Definición del payload sintético de intrusión perimetral
    const newAlert = {
      id_sensor: "SENS-PERIM-04",
      zona: "Perímetro Norte",
      nivel_certeza: 92,
      timestamp: new Date().toISOString(), // Marca temporal en tiempo de ejecución estándar
      prioridad: "Alta",
      estado: "Activa"
    };

    try {
      // Despacho e inserción atómica del nuevo documento en la colección
      const docRef = await addDoc(collection(db, ALERTS_COLLECTION), newAlert);
      
      // Retorna la alerta acoplada con su identificador real asignado por el backend
      return {
        id_alerta: docRef.id,
        ...newAlert
      } as AlertData;
    } catch (e) {
      console.error("Error inyectando alerta en Firebase:", e);
      throw e; // Relanza la excepción para ser capturada por el componente visual emisor
    }
  }

  // ========================================================================
  // MÉTODO: updateAlertStatus (Resolución de Incidencias en Turno)
  // ========================================================================
  /**
   * Modifica el estado y reevalúa la prioridad de una alerta específica.
   * Regla de negocio analítica:
   * - Si el operador selecciona 'Confirmar', el evento se cierra manteniendo prioridad 'Alta'.
   * - Si el operador selecciona cualquier otro flujo (Falsa alarma), la prioridad se degrada a 'Baja'.
   * @param id_alerta Identificador único del documento a mutar.
   * @param decision Criterio táctico de resolución ('Confirmar' u otros).
   */
  static async updateAlertStatus(id_alerta: string, decision: string): Promise<void> {
    try {
      // Obtención del puntero de referencia del documento
      const alertRef = doc(db, ALERTS_COLLECTION, id_alerta);
      
      // Ejecución de la mutación parcial (patch) sobre el registro remoto
      await updateDoc(alertRef, {
        estado: 'Resuelta/Cerrada',
        prioridad: decision === 'Confirmar' ? 'Alta' : 'Baja'
      });
    } catch (e) {
      console.error("Error actualizando estado en Firebase:", e);
    }
  }

  // ========================================================================
  // MÉTODO: clearAll (Purga Completa del Historial / Mantenimiento)
  // ========================================================================
  /**
   * Realiza un barrido masivo eliminando todos los documentos de la colección de alertas.
   * Nota de infraestructura: Ejecuta eliminaciones individuales de forma asíncrona paralela.
   */
  static async clearAll(): Promise<void> {
    try {
      // Descarga de todas las referencias de documentos existentes
      const querySnapshot = await getDocs(collection(db, ALERTS_COLLECTION));
      
      // Iteración y destrucción atómica de cada nodo documental por ID
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, ALERTS_COLLECTION, document.id));
      });
    } catch (e) {
      console.error("Error limpiando memoria en Firebase:", e);
    }
  }
}