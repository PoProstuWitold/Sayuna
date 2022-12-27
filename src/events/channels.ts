import type { ArgsOf, Client } from 'discordx'
import { Discord, On } from 'discordx'
import logger from '../utils/logger.js'

@Discord()
export abstract class Channels {
	@On({
		event: 'channelCreate'
	})
	channelCreate([channel]: ArgsOf<'channelCreate'>, client: Client): void {
		logger.info(`Channel Created. Guild: ${channel.guild.name}, channel: ${channel.name}`)
	}

	@On({
		event: 'channelDelete'
	})
	channelDelete([channel]: ArgsOf<'channelDelete'>, client: Client): void {
		logger.info(`Channel Deleted`)
	}
}
