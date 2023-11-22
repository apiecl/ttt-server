FROM node:20-alpine
EXPOSE 8989
RUN npm install && npm run build
RUN npm run start