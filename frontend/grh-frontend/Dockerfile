FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install zone.js 
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/grh-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80