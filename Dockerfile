# base setup stage (dependencies + pnpm)
FROM node:jod-alpine AS setup

WORKDIR /app

# Install ffmpeg and global dependencies (pnpm)
RUN apk add --no-cache ffmpeg \
    && npm install -g pnpm

# Copy dependency files first for better caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy rest of the source code
COPY . .

# development stage
FROM setup AS development

# Set node environment to development
ENV NODE_ENV=development

# Pass necessary environment variables for development
ENV DEV_GUILD_ID=$DEV_GUILD_ID \
    BOT_TOKEN=$BOT_TOKEN \
    OWNER_ID=$OWNER_ID \
    BOT_ID=$BOT_ID \
    BOT_PREFIX=$BOT_PREFIX \
    AI_ENABLED=$AI_ENABLED \
    CHAT_GPT_API_KEY=$CHAT_GPT_API_KEY \
    LOG_EVERYTHING=$LOG_EVERYTHING

# Start development server
CMD ["pnpm", "run", "dev"]

# production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install runtime dependencies (ffmpeg, pm2, pnpm)
RUN apk add --no-cache ffmpeg \
    && npm install -g pnpm pm2

# Copy prepared source files and dependencies from setup stage
COPY --from=setup /app ./

# Build application for production
RUN pnpm run build

# Set node environment to production
ENV NODE_ENV=production \
    BOT_TOKEN=$BOT_TOKEN \
    OWNER_ID=$OWNER_ID \
    BOT_ID=$BOT_ID \
    BOT_PREFIX=$BOT_PREFIX \
    AI_ENABLED=$AI_ENABLED \
    CHAT_GPT_API_KEY=$CHAT_GPT_API_KEY \
    LOG_EVERYTHING=$LOG_EVERYTHING

# Run the bot with pm2 in production mode
CMD ["pm2-runtime", "build/main.js"]
