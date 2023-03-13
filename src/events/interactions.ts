import type { ArgsOf, Client } from 'discordx'
import { Discord, On } from 'discordx'
import { injectable } from 'tsyringe'

import { CustomLogger } from '../services/logger.service.js'


@Discord()
@injectable()
export class Interactions {

	constructor(
        private logger: CustomLogger
    ) {}

	@On({
		event: 'interactionCreate'
	})
	interactionCreate([interaction]: ArgsOf<'interactionCreate'>, client: Client): void {
		this.logger.info(`Interaction created.`)
        client.executeInteraction(interaction)
	}
}
