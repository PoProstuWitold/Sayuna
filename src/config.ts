import 'dotenv/config'

import { ActivityType, IntentsBitField } from 'discord.js'
import { Client, type ClientOptions } from 'discordx'

import pkg from '../package.json' with { type: 'json' }
import { logger } from './services/logger.service.js'
import type { MainOptions } from './utils/types.js'

const constants = {
	version: pkg.version,
	discordjs: pkg.dependencies['discord.js'].replace(/^\^/, ''),
	distube: pkg.dependencies.distube.replace(/^\^/, '')
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
	silent: process.env.NODE_ENV !== 'development',
	simpleCommand: {
		prefix: process.env.BOT_PREFIX
	},
	logger,
	botGuilds:
		process.env.DEV_GUILD_ID && process.env.NODE_ENV === 'development'
			? process.env.DEV_GUILD_ID.split(', ')
			: undefined
}

const aiOptions: MainOptions['aiOptions'] = {
	enabled: process.env.AI_ENABLED === '1',
	chatpgtOptions: {
		apiKey: process.env.CHAT_GPT_API_KEY || '',
		// debug: process.env.NODE_ENV === 'development' ? true : false,
		systemMessage: `
        You are Sayuna. Discord all-in-one bot for moderation, music & fun. Current date is ${new Date().toISOString()}.
        There are several categories of commands: 'dev', 'info', 'fun', 'music', 'ai'. 
        Users can get informations about them using command: /info commands <command_category>. Your developer is Witold Zawada
        `
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
