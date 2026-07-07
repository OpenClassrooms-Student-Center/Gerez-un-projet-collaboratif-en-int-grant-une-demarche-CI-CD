FROM node:18-alpine AS build

WORKDIR /usr/local/app
COPY ./ /usr/local/app/

RUN npm ci
RUN npm run build
 
FROM nginx:alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/local/app/dist/bobapp /usr/share/nginx/html

EXPOSE 80