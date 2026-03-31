FROM node:22-alpine
WORKDIR /app
COPY apps/gitfinder-worker/ .
ENV NODE_ENV=production
EXPOSE 4632
ENV PORT=4632
ENV HOSTNAME=0.0.0.0
CMD ["node", "src/index.js"]
