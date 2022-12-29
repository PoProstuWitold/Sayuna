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
                this.logger.warn('Development mode')
                await client.clearApplicationCommands(process.env.DEV_GUILD_ID)
                await client.initApplicationCommands({
                    global: {
                        disable: {
                            add: true,
                            delete: true,
                            update: true
                        }
                    }
                })
            }

            // PRODUCTION MODE
            if(process.env.NODE_ENV === 'production') {
                this.logger.warn('Production mode')
                await client.clearApplicationCommands()
                await client.initApplicationCommands()
            }

            this.logger.info(botId ? `Bot "${botId}" started. GLHF!` : `Bot started. GLHF!`)
        } catch (err) {
            this.logger.error(err)
            client.destroy()
        }
    }
}
