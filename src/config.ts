import { IntentsBitField } from 'discord.js'
import { Client, type ClientOptions } from 'discordx'

import pkg from '../package.json' with { type: 'json' }
import { logger } from './services/logger.service.js'
import { getActivityType } from './utils/functions.js'
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
		IntentsBitField.Flags.GuildModeration,
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

const config: MainOptions['config'] = {
	token: process.env.BOT_TOKEN,
	devGuildId: process.env.DEV_GUILD_ID,
	ownerId: process.env.OWNER_ID,
	activity: {
		name: process.env.ACTIVITY_NAME ?? 'Music',
		type: getActivityType(process.env.ACTIVITY_TYPE)
	}
}

const client = new Client(clientOptions)

export const globalConfig: MainOptions = {
	clientOptions,
	config,
	constants,
	client
}
