import type { ChatGPTAPIOptions } from 'chatgpt'
import type { ActivityType } from 'discord.js'
import type { Client, ClientOptions } from 'discordx'

export interface FeatureEnabledGuardOptions {
	enabled: boolean
	feature: string
	reason?: string
}

export interface MainOptions {
	clientOptions: ClientOptions
	config: {
		token?: string
		devGuildId?: string
		ownerId?: string
		activity: {
			name: string
			type: ActivityType
		}
	}
	aiOptions: {
		enabled: boolean
		chatpgtOptions?: ChatGPTAPIOptions
	}
	constants: {
		version: string
		discordjs: string
		distube: string
	}
	client: Client
}

export interface CommandDocs {
	name: string
	description: string
	category: string | undefined
}

export interface MemeJson {
	postLink: string
	subreddit: string
	title: string
	url: string
	nsfw: boolean
	spoiler: boolean
	author: string
	ups: number
	preview: string[]
}
