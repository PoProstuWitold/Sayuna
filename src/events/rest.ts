import type { RestArgsOf } from 'discordx'
import { Discord, On } from 'discordx'
import { injectable } from 'tsyringe'

import { CustomLogger } from '../services/logger.service.js'


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
		const { limit, timeToReset, method, route, url } = data
		this.logger.warn(`
		You are being rate-limited. 
		Limit: ${limit}
		Time to reset (seconds): ${timeToReset/1000} seconds
		url: ${url}
		route: ${route}
		method: ${method}
		`)
	}
}
