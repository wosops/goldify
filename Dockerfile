FROM node:18-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm ci --no-audit --no-fund --legacy-peer-deps

COPY . /app

RUN npm run build

# Default runtime serves the static build (Vite outputs to dist)
CMD ["npx", "serve", "-s", "dist"]