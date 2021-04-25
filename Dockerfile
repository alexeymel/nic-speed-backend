# Production
FROM node:alpine as production-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY ./ .
CMD npm run prod