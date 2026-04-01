FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY src/ ./src/

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 appuser
RUN chown -R appuser:nodejs /app
USER appuser

EXPOSE 4632
ENV PORT=4632
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

CMD ["node", "src/index.js"]
