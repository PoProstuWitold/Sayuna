import type { RestArgsOf } from 'discordx'
import { Discord, On } from 'discordx'
import logger from '../utils/logger.js'

@Discord()
export abstract class Rest {
	@On.rest({
		event: 'rateLimited'
	})
	rateLimited([data]: RestArgsOf<'rateLimited'>): void {
		logger.warn(`You are being rate-limited: ${data.url}`)
	}
}
