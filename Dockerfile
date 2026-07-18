FROM node:krypton-alpine AS build

WORKDIR /app

ENV CI=true

RUN apk add --no-cache \
    ffmpeg \
    python3 \
    make \
    g++ \
    && npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build && pnpm prune --prod

FROM node:krypton-alpine AS production

WORKDIR /app

LABEL org.opencontainers.image.title="Sayuna" \
      org.opencontainers.image.description="Your all-in-one Discord assistant for moderation, music & fun! A powerful and extensible Discord bot." \
      org.opencontainers.image.source="https://github.com/PoProstuWitold/Sayuna" \
      org.opencontainers.image.url="https://hub.docker.com/r/poprostuwitold/sayuna" \
      org.opencontainers.image.documentation="https://github.com/PoProstuWitold/Sayuna#readme" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.authors="Witold Zawada (PoProstuWitold)"

RUN addgroup -S sayuna && adduser -S sayuna -G sayuna

RUN apk add --no-cache \
    ffmpeg \
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