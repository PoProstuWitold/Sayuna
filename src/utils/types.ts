import { ChatGPTAPIOptions } from 'chatgpt'
import { ActivityType } from 'discord.js'
import { Client, ClientOptions } from 'discordx'

export interface MainOptions {
	clientOptions: ClientOptions,
	config: {
		token: string | undefined,
		devGuildId?: string | undefined,
		ownerId?: string | undefined,
		activity: {
			name: string,
			type: ActivityType
		}
	}
	aiOptions: {
		enabled: boolean
		chatpgtOptions?: any
	}
}


export interface MusicPlayerOptions {
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