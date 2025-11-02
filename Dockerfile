FROM node:krypton-alpine AS build

WORKDIR /app

RUN apk add --no-cache ffmpeg \
    && npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build && pnpm prune --prod

FROM node:krypton-alpine AS production

WORKDIR /app

RUN addgroup -S sayuna && adduser -S sayuna -G sayuna

RUN apk add --no-cache ffmpeg \
    && npm install -g pm2

COPY --from=build /app /app

RUN chown -R sayuna:sayuna /app
USER sayuna

ENV NODE_ENV=production

ENV OWNER_ID= \
    BOT_ID= \
    BOT_PREFIX= \
    DEBUG_LOGS=

ENTRYPOINT ["pm2-runtime"]
CMD ["build/main.js"]