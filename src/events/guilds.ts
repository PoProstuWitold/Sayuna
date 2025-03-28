import type { ArgsOf } from 'discordx'
import { Discord, On } from 'discordx'

import { type CustomLogger, logger } from '../services/logger.service.js'

@Discord()
export class Threads {
	private logger: CustomLogger = logger

	@On({
		event: 'guildCreate'
	})
	guildCreate([guild]: ArgsOf<'guildCreate'>): void {
		this.logger.info(
			`Joined guild - id: "${guild.id}", name: "${guild.name}"`
		)
	}

	@On({
		event: 'guildDelete'
	})
	guildDelete([guild]: ArgsOf<'guildDelete'>): void {
		this.logger.info(
			`Left guild - id: "${guild.id}", name: "${guild.name}"`
		)
	}
}
