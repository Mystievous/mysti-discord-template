FROM node:26-slim

ENV NODE_ENV=production

WORKDIR /app

# Dependencies first: this layer is cached until package.json or the lockfile change

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

COPY . .

# Run as the image's built-in non-root user
USER node

# Run tsx through node directly (not `npm start`), so node receives stop signals
CMD ["node", "--import", "tsx", "index.ts"]
