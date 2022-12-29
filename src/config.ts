import 'dotenv/config'

import { IntentsBitField } from 'discord.js'
import { ClientOptions } from 'discordx'
import { container } from 'tsyringe'

import { CustomLogger } from './services/logger.js'

const logger = container.resolve(CustomLogger)

export const clientOptions: ClientOptions = {
    botId: 'Sayuna',
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
        prefix: '!'
    },
    logger,
    botGuilds: process.env.DEV_GUILD_ID && process.env.NODE_ENV === 'development' ? [process.env.DEV_GUILD_ID] : undefined,
}