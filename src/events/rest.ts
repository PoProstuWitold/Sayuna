import type { RestArgsOf } from 'discordx'
import { Discord, On } from 'discordx'

import { type CustomLogger, logger } from '../services/logger.service.js'

@Discord()
export class Rest {
	private logger: CustomLogger = logger

	@On.rest({
		event: 'rateLimited'
	})
	rateLimited([data]: RestArgsOf<'rateLimited'>): void {
		const { limit, timeToReset, method, route, url } = data
		this.logger.warn(`
		You are being rate-limited. 
		Limit: ${limit}
		Time to reset (seconds): ${timeToReset / 1000} seconds
		url: ${url}
		route: ${route}
		method: ${method}
		`)
	}
}
