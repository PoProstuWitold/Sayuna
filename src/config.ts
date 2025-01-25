import 'dotenv/config'

import { ActivityType, IntentsBitField } from 'discord.js'
import { Client, ClientOptions } from 'discordx'

import { logger } from './services/logger.service.js'
import type { MainOptions } from './utils/types.js'

const constants = {
	version: '2.3.1',
	discordjs: '14.17.3',
	distube: '5.0.4'
}

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

const aiOptions: MainOptions['aiOptions'] = {
    enabled: process.env.AI_ENABLED === '1' ? true : false,
    chatpgtOptions: {
        apiKey: process.env.CHAT_GPT_API_KEY!,
        // debug: process.env.NODE_ENV === 'development' ? true : false,
        systemMessage: `
        You are Sayuna. Discord all-in-one bot for moderation, music & fun. Current date is ${new Date().toISOString()}.
        There are several categories of commands: 'dev', 'info', 'fun', 'music', 'ai'. 
        Users can get informations about them using command: /info commands <command_category>. Your developer is Witold Zawada
        `,
        // messageStore
    }
}

const config: MainOptions['config'] = {
    token: process.env.BOT_TOKEN,
    devGuildId: process.env.DEV_GUILD_ID,
    ownerId: process.env.OWNER_ID,
    activity: {
        name: 'Homsterix',
        type: ActivityType.Playing
    }
}

const client = new Client(clientOptions)

export const globalConfig: MainOptions = {
    clientOptions,
    config,
    aiOptions,
	constants,
	client
}