### build
FROM node:lts-iron AS setup

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY . .

RUN apt-get update && apt-get install -y ffmpeg
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

### development
FROM setup AS development

ENV NODE_ENV='development' \
	DEV_GUILD_ID=$DEV_GUILD_ID \
    BOT_TOKEN=$BOT_TOKEN \
    OWNER_ID=$OWNER_ID \
    BOT_ID=$BOT_ID \
    BOT_PREFIX=$BOT_PREFIX \
    AI_ENABLED=$AI_ENABLED \
    CHAT_GPT_API_KEY=$CHAT_GPT_API_KEY

CMD [ "pnpm", "run", "dev" ]

### production
FROM setup AS production

ENV NODE_ENV='production' \
    BOT_TOKEN=$BOT_TOKEN \
    OWNER_ID=$OWNER_ID \
    BOT_ID=$BOT_ID \
    BOT_PREFIX=$BOT_PREFIX \
    AI_ENABLED=$AI_ENABLED \
    CHAT_GPT_API_KEY=$CHAT_GPT_API_KEY \
    PORT=${PORT:-3000}

WORKDIR /app

COPY --from=setup /app .

RUN npm install -g pm2 \
    && pnpm run build

CMD ["pm2-runtime", "build/main.js"]