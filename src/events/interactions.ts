import type { ArgsOf, Client } from 'discordx'
import { Discord, On } from 'discordx'
import logger from '../utils/logger.js'

@Discord()
export abstract class Interactions {
	@On({
		event: 'interactionCreate'
	})
	interactionCreate([interaction]: ArgsOf<'interactionCreate'>, client: Client): void {
		logger.info(`Interaction created.`)
        client.executeInteraction(interaction)
	}
}
