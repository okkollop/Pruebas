FROM node:22-alpine
WORKDIR /app
COPY server/ ./server/
COPY portal/ ./portal/
ENV NODE_ENV=production PORT=80
EXPOSE 80
USER node
# Para escuchar en el puerto 80 sin root se usa la capacidad de docker-compose (sysctls)
CMD ["node", "server/server.js"]
