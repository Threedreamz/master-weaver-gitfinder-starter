FROM node:22-alpine
WORKDIR /app
COPY apps/gitfinder-api/ .
ENV NODE_ENV=production
EXPOSE 4631
ENV PORT=4631
ENV HOSTNAME=0.0.0.0
CMD ["node", "src/index.js"]
