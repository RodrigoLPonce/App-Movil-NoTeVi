# NoTeVi - Módulo de Monitoreo Activo (Fase 1) 🛡️

Módulo móvil del sistema de seguridad perimetral, diseñado para mitigar la "fatiga por alarmas" mediante la gestión de eventos.

## Instalación Rápida

Este proyecto está construido con Expo y React Native. Para iniciar el entorno de simulación local, sigue estos pasos:

1. **Clonar el repositorio:**

   ```bash
   git clone [https://github.com/RodrigoLPonce/App-Movil-NoTeVi.git](https://github.com/RodrigoLPonce/App-Movil-NoTeVi.git)
   cd notevi-app
   ```

2. **Preparar dependencias del proyecto**
   ejecutar para poder instalar las dependencias de node.js en su entorno.

   ```bash
   npm install
   ```
3. **Despliegue con Docker**
   ejecutar para leer el Dockerfile y empaquetar la aplicación web.
      ```bash
   docker build -t notevi-app .
   ```

4. **Levantar el contenedor**
   ejecutar para iniciar el servidor y exponer el puerto en tu navegador (localhost:8081).
      ```bash
   docker run -p 8081:8081 notevi-app
   ```

> [!IMPORTANT]
> Este proyecto debe ejecutarse mediante **Docker**.
> No utilizar `npx expo start` para el despliegue o pruebas estándar.