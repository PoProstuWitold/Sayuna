import type { Client } from 'discordx'
import { ActivityType } from 'discord.js'
import { Discord, On } from 'discordx'
import { injectable } from 'tsyringe'

import { CustomLogger } from '../services/logger.js'


@Discord()
@injectable()
export class Bot {

    constructor(
        private logger: CustomLogger
    ) {}

	@On({
        event: 'ready'
    })
    async ready([client]: [Client]) {
        try {
            //@ts-ignore
            const botId = client.options.botId
            if(client.user) {
                client.user.setActivity('Heroes 3', { type: ActivityType.Playing })
            }

            // DEV MODE
            if(process.env.NODE_ENV === 'development' && process.env.DEV_GUILD_ID) {
                this.logger.info('DEVELOPMENT MODE')
                await client.clearApplicationCommands(process.env.DEV_GUILD_ID)
                await client.initApplicationCommands()
            }

            // PRODUCTION MODE
            if(process.env.NODE_ENV === 'production') {
                this.logger.info('PRODUCTION MODE')
                await client.clearApplicationCommands()
                await client.initApplicationCommands()
            }

            this.logger.info(`Bot "${botId}" started! GLHF!`)
        } catch (err) {
            // logger.error(err)
            client.destroy()
        }
    }
}
