import { Client, Once } from 'discordx'
import { ActivityType } from 'discord.js'
import { Discord } from 'discordx'
import { injectable } from 'tsyringe'

import { CustomLogger } from '../services/logger.service.js'
import { MusicManager } from '../services/music.service.js'


@Discord()
@injectable()
export class Bot {

    constructor(
        private logger: CustomLogger,
        private musicManager: MusicManager
    ) {}

	@Once({
        event: 'ready'
    })
    async ready([client]: [Client]) {
        try {
            //@ts-ignore
            const botId = client.options.botId
            if(client.user) {
                client.user.setActivity('Detroit: Become Human', { type: ActivityType.Playing })
            }

            // DEV MODE
            if(process.env.NODE_ENV === 'development' && process.env.DEV_GUILD_ID) {
                this.logger.warn('Development mode')
                // causes DiscordAPIError[30034]: Max number of daily application command creates has been reached (200)
                // await client.clearApplicationCommands(process.env.DEV_GUILD_ID)
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
                // causes DiscordAPIError[30034]: Max number of daily application command creates has been reached (200)
                // await client.clearApplicationCommands()
                await client.initApplicationCommands()
            }

            this.musicManager.listen()
            this.logger.info(botId ? `Bot "${botId}" started. GLHF!` : `Bot started. GLHF!`)
        } catch (err) {
            this.logger.error(err)
            client.destroy()
        }
    }
}
