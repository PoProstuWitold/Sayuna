### build
FROM node:lts AS setup

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY . .

RUN apt-get update && apt-get install -y ffmpeg
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile


### development
FROM setup AS development

ENV NODE_ENV='development'

WORKDIR /app

CMD [ "pnpm", "run", "dev" ]

### production
FROM setup AS production

ENV NODE_ENV='production'

WORKDIR /app

COPY --from=setup /app .

RUN npm install -g pm2

ENV BOT_TOKEN=$BOT_TOKEN \
    DEV_GUILD_ID=$DEV_GUILD_ID \
    OWNER_ID=$OWNER_ID \
    BOT_ID=$BOT_ID \
    BOT_PREFIX=$BOT_PREFIX \
    AI_ENABLED=$AI_ENABLED \
    CHAT_GPT_API_KEY=$CHAT_GPT_API_KEY \
    PORT=${PORT:-3000}

EXPOSE ${PORT}

RUN pnpm run build
CMD ["pm2-runtime", "build/main.js"]