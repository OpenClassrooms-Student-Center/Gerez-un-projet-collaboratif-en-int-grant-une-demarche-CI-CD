FROM node:18.19.0-alpine3.18 AS build

WORKDIR /usr/local/app
COPY ./ /usr/local/app/
RUN yarn && yarn cache clean
RUN npm run build

FROM nginx:1.25.3-alpine AS production

RUN adduser -D user
COPY --from=build /usr/local/app/dist/bobapp /usr/share/nginx/html
RUN chown -R user:user /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80