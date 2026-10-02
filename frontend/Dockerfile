# ==========================================
# Etapa 1: Compilación de la aplicación Angular
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Copia de manifiestos e instalación de dependencias limpias
COPY package*.json ./
RUN npm ci

# Copia del código fuente y compilación para producción
COPY . .
RUN npm run build -- --configuration production

# ==========================================
# Etapa 2: Servidor Nginx ultra-ligero
# ==========================================
FROM nginx:1.27-alpine

# Limpieza del contenido por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia del build generado por Angular (Application Builder)
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copia de la configuración de Nginx con soporte SPA y Reverse Proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
