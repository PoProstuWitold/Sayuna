import type { ArgsOf, Client } from 'discordx'
import { Discord, On } from 'discordx'

import { type CustomLogger, logger } from '../services/logger.service.js'

@Discord()
export class Channels {
	private logger: CustomLogger = logger

	@On({
		event: 'channelCreate'
	})
	channelCreate([channel]: ArgsOf<'channelCreate'>, _client: Client): void {
		this.logger.info(
			`Channel Created. Guild: ${channel.guild.name}, channel: ${channel.name}`
		)
	}

	@On({
		event: 'channelDelete'
	})
	channelDelete([_channel]: ArgsOf<'channelDelete'>, _client: Client): void {
		this.logger.info('Channel Deleted')
	}
}
