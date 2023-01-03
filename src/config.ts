import 'dotenv/config'

import { IntentsBitField } from 'discord.js'
import { ClientOptions } from 'discordx'
import { container } from 'tsyringe'

import { CustomLogger } from './services/logger.js'
import { MainOptions } from './main.js'

const logger = container.resolve(CustomLogger)

const clientOptions: ClientOptions = {
    botId: process.env.BOT_ID,
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildBans,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildIntegrations
    ],
    silent: process.env.NODE_ENV === 'development' ? false : true,
    simpleCommand: {
        prefix: process.env.BOT_PREFIX
    },
    logger,
    botGuilds: process.env.DEV_GUILD_ID && process.env.NODE_ENV === 'development' ? process.env.DEV_GUILD_ID.split(', ') : undefined
}

export const globalConfig: MainOptions = {
    clientOptions,
    config: {
        token: process.env.BOT_TOKEN,
        devGuildId: process.env.DEV_GUILD_ID,
        ownerId: process.env.OWNER_ID
    }
}