import type { ArgsOf, Client } from 'discordx'
import { Discord, On } from 'discordx'
import { injectable } from 'tsyringe'

import { CustomLogger } from '../services/logger.service.js'


@Discord()
@injectable()
export class Channels {

	constructor(
        private logger: CustomLogger
    ) {}

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
