import type { ArgsOf, Client } from 'discordx'
import { Discord, On } from 'discordx'

import { CustomLogger, logger } from '../services/logger.service.js'

@Discord()
export class Channels {
	private logger: CustomLogger = logger

	@On({
		event: 'channelCreate'
	})
	channelCreate([channel]: ArgsOf<'channelCreate'>, client: Client): void {
		this.logger.info(`Channel Created. Guild: ${channel.guild.name}, channel: ${channel.name}`)
	}

	@On({
		event: 'channelDelete'
	})
	channelDelete([channel]: ArgsOf<'channelDelete'>, client: Client): void {
		this.logger.info(`Channel Deleted`)
	}
}