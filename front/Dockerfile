# ===== BUILD STAGE =====
FROM node:18 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# ===== NGINX STAGE =====
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/bobapp /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]