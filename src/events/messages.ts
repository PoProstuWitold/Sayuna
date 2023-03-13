import type { ArgsOf, Client } from 'discordx'
import { Discord, On } from 'discordx'
import { injectable } from 'tsyringe'

import { CustomLogger } from '../services/logger.service.js'


@Discord()
@injectable()
export class Messages {

	constructor(
        private logger: CustomLogger
    ) {}

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
