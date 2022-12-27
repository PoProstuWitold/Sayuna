import type { ArgsOf, Client } from 'discordx'
import { Discord, On } from 'discordx'
import logger from '../utils/logger.js'

@Discord()
export abstract class Messages {
	@On({
		event: 'messageCreate'
	})
	messageCreate([message]: ArgsOf<'messageCreate'>, client: Client): void {
		logger.info(`Message Created. Author: ${message.author.username}, content: ${message.content}`)
		client.executeCommand(message)
	}

	@On({
		event: 'messageDelete'
	})
	messageDelete([message]: ArgsOf<'messageDelete'>, client: Client): void {
		logger.info(`Message Deleted. Author: ${message.author?.username}, content: ${message.content}`)
	}
}
