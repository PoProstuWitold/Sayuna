import type { ArgsOf, Client } from 'discordx'
import { Discord, On } from 'discordx'

import { type CustomLogger, logger } from '../services/logger.service.js'

@Discord()
export class Interactions {
	private logger: CustomLogger = logger

	@On({
		event: 'interactionCreate'
	})
	interactionCreate(
		[interaction]: ArgsOf<'interactionCreate'>,
		client: Client
	): void {
		this.logger.info('Interaction created.')
		client.executeInteraction(interaction)
	}
}
