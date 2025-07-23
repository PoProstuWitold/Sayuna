# Sayuna

Easily extensible and customizable all-in-one Discord bot. Moderation, music & fun!
Written in Typescript, Node.js, discord.js, discordx, ESM.

## Docker

You can run this bot using official **[Docker image](https://hub.docker.com/r/poprostuwitold/sayuna)**. There are all instructions and available options for running in Docker container.

## Requirements
- Node.js v22.17.0 'Jod' (LTS)
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
BOT_TOKEN=''

# Development (optional)
# you can provide more than one using syntax: 'guild_id1, guild_id2' 1242471380587646986
DEBUG_LOGS=false
DEV_GUILD_ID=''

# Owner commands, cleaner logs & legacy message commands (optional)
OWNER_ID=''
BOT_ID='Sayuna'
BOT_PREFIX='$$'

# Spotify API (optional)
# Spotify links will not work very well without these credentials
SPOTIFY_CLIENT_ID=''
SPOTIFY_CLIENT_SECRET=''
```

#### 1.  Install dependencies
```bash
pnpm install
```

#### 2.  Run in ``development`` or ``production`` mode using npm scripts


## TO DO
- [x] Logging
- [x] Error handling
- [x] Commands
	- [x] Fun commands
	- [x] Music Commands
        - [x] Current music dashboard with real-time updates
	- [x] Moderation commands

## LICENSE
[MIT](https://choosealicense.com/licenses/mit/)