# Usamos una imagen de Node más moderna
FROM node:20-alpine

# Definimos la carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código fuente de la app
COPY . .

# Exponemos el puerto estándar de la versión Web de Expo
EXPOSE 8081

# Comando clave: Inicia Expo en modo web usando la red local del contenedor
CMD ["npx", "expo", "start", "--web", "--lan", "--port", "8081"]