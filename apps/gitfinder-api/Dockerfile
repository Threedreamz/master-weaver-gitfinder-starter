FROM node:20-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY src/ ./src/

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 appuser
RUN chown -R appuser:nodejs /app
USER appuser

EXPOSE 4631
ENV PORT=4631
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

CMD ["node", "src/index.js"]
