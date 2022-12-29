import type { RestArgsOf } from 'discordx'
import { Discord, On } from 'discordx'
import { injectable } from 'tsyringe'

import { CustomLogger } from '../services/logger.js'


@Discord()
@injectable()
export class Rest {

	constructor(
        private logger: CustomLogger
    ) {}

	@On.rest({
		event: 'rateLimited'
	})
	rateLimited([data]: RestArgsOf<'rateLimited'>): void {
		this.logger.warn(`You are being rate-limited`)
	}
}
