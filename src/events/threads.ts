import type { ArgsOf } from 'discordx'
import { Discord, On } from 'discordx'
import { injectable } from 'tsyringe'

import { CustomLogger } from '../services/logger.service.js'


@Discord()
@injectable()
export class Threads {

	constructor(
        private logger: CustomLogger
    ) {}

	@On({
		event: 'threadCreate'
	})
	async threadCreate([thread]: ArgsOf<'threadCreate'>): Promise<void> {
		try {
            if(thread.joinable && !thread.joined) {
                this.logger.warn(`Unable to join created thread - name: "${thread.name}", id: "${thread.guildId}"`)
                return
            }
            await thread.join()
            if(thread.joined) {
                this.logger.info(`Joined thread: "${thread.name}"`, thread.guildId)
            }
        } catch (err) {
            this.logger.error(err)
            return
        }
	}
}
