import type { ArgsOf, Client } from 'discordx'
import { Discord, On } from 'discordx'

import { CustomLogger, logger } from '../services/logger.service.js'

@Discord()
export class Messages {
	private logger: CustomLogger = logger

	@On({
		event: 'messageCreate'
	})
	messageCreate([message]: ArgsOf<'messageCreate'>, client: Client): void {
		this.logger.info(`Message Created. Author: ${message.author.username}, content: "${message.content}"`)
		client.executeCommand(message)
	}

	@On({
		event: 'messageDelete'
	})
	messageDelete([message]: ArgsOf<'messageDelete'>, client: Client): void {
		this.logger.info(`Message Deleted. Author: ${message.author?.username}`)
	}
}