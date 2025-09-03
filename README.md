# Sayuna

## ***"Your all-in-one Discord assistant for moderation, music & fun!"***

A powerful and extensible Discord bot built with TypeScript, Node.js, discord.js, and discordx (ESM-ready).

<hr>

## Features

### Core
- Robust logging system
- Global error handling
- Simple setup with environment variables and Docker

### Music
- Many music sources via plugins
- Realtime music dashboard

### Moderation
- Slash commands to manage users and channels
- Kick, ban, mute and more

### Fun
- Memes, gifs and general fun commands

### Developer Tools
- Owner-only commands
- Debugging options and developer logs

---

## Docker Support

You can run Sayuna using the official **[Docker image](https://hub.docker.com/r/poprostuwitold/sayuna)**.  
All runtime options and environment variables are documented there.

```bash
services:
  sayuna:
    container_name: sayuna
    image: poprostuwitold/sayuna:latest
    stdin_open: true
    tty: true
    env_file:
     - .env
    # environment:
    #   - BOT_TOKEN=
    #   - DEV_GUILD_ID=
    #   - OWNER_ID=
    #   - BOT_ID='Sayuna'
    #   - BOT_PREFIX='$$'
    #   - ACTIVITY_NAME=''
    #   - ACTIVITY_TYPE=''
    #   - SPOTIFY_CLIENT_ID=''
    #   - SPOTIFY_CLIENT_SECRET=''
    restart: unless-stopped
```

---

## Requirements

- Node.js `v22.19.0` (LTS, codename: "Jod")
- `ffmpeg` installed and available in `$PATH` ([download here](https://ffmpeg.org/download.html))
- Discord bot token & server

Or just use **Docker** for a simpler production setup.

---

## Environment Configuration

Create a `.env` file in the root directory:

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

# Activity settings (optional)
ACTIVITY_NAME='Music'
ACTIVITY_TYPE=''

# Spotify API (optional)
# Spotify links will not work very well without these credentials
SPOTIFY_CLIENT_ID=''
SPOTIFY_CLIENT_SECRET=''
```

---

## Usage

Install dependencies:

```bash
pnpm install
```

Run in **development** or **production** mode using npm scripts:

```bash
pnpm dev     # development mode
pnpm start   # production mode
```

---

## To-Do / Progress

- [x] Logging system
- [x] Error handling
- [x] Slash commands
  - [x] Owner
  - [x] Moderation
  - [x] General
	- [x] Fun
	- [x] Info
	- [x] Music
	  - [x] Real-time music dashboard

---

## License

[MIT](https://choosealicense.com/licenses/mit/)