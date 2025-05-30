# Sayuna

Easily extensible and customizable all-in-one Discord bot. Moderation, music & fun!
Written in Typescript, Node.js, discord.js, discordx, ESM.

## Docker

You can run this bot using official **[Docker image](https://hub.docker.com/r/poprostuwitold/sayuna)**. There are all instructions and available options for running in Docker container.

## Requirements
- Node.js v22.16.0 'Jod' (LTS)
- ffmpeg (installation instructions can be found [here](https://ffmpeg.org/download.html))
- Discord bot account and a Discord server

...or just Docker to run production version.

## Features
- Logging
- Error handling
- Slash commands
    - General (info, music, fun)
    - Moderation (managing users and channels)
    - Owner (dev)


## Usage
#### 0.  Create ``.env`` file in server root directory and fill with following:

```ini
# ALL ENV
BOT_TOKEN=

# DEV
# you can provide more than one using syntax: 'guild_id1, guild_id2'
DEV_GUILD_ID=

# OWNER COMMANDS
OWNER_ID=

# CLEANER LOGS & LEGACY MESSAGE COMMANDS (OPTIONAL)
BOT_ID=
BOT_PREFIX=

# AI
# Access token for talking to ChatGPT
AI_ENABLED=
CHAT_GPT_API_KEY=

# Debug logs in production
DEBUG_LOGS=true
```

#### 1.  Install dependencies
```bash
pnpm install
```

#### 2.  Run in ``development`` or ``production`` mode using npm scripts


## TO DO
- [x] Logging
- [x] Error handling
- [x] AI
- [x] Commands
	- [x] Fun commands
	- [x] Music Commands
        - [x] Current music dashboard with real-time updates
	- [x] Moderation commands

## LICENSE
[MIT](https://choosealicense.com/licenses/mit/)