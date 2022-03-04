# develop stage
FROM node:16-alpine as develop-stage
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

# build stage
FROM develop-stage as build-stage
RUN unset NODE_OPTIONS
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY default.conf /etc/nginx/conf.d/
COPY --from=build-stage /app/dist /usr/share/nginx/html
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'