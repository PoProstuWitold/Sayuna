import { ChatGPTAPIOptions } from 'chatgpt'
import { Client, ClientOptions } from 'discordx'

export interface MainOptions {
	clientOptions: ClientOptions,
	config: {
		token: string | undefined,
		devGuildId?: string | undefined,
		ownerId?: string | undefined
	}
	aiOptions: {
		enabled: boolean
		chatpgtOptions?: ChatGPTAPIOptions
	}
}


export interface MusicPlayerOptions {
	client: Client
}