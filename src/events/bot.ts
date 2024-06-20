import { Client, Once, Discord } from 'discordx'
import { injectable } from 'tsyringe'

import { CustomLogger } from '../services/logger.service.js'
import { MusicManager } from '../services/music.service.js'
import { globalConfig } from '../config.js'


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
                client.user.setActivity(
                    globalConfig.config.activity.name, 
                    { type: globalConfig.config.activity.type }
                )
            }

            // DEV MODE
            if(process.env.NODE_ENV === 'development' && process.env.DEV_GUILD_ID) {
                this.logger.warn('Development mode')
				await client.clearApplicationCommands()
				if(process.env.DEV_GUILD_ID) {
					await client.clearApplicationCommands(process.env.DEV_GUILD_ID)
				}
                await client.initApplicationCommands()
            }

            // PRODUCTION MODE
            if(process.env.NODE_ENV === 'production') {
                this.logger.warn('Production mode')
				await client.clearApplicationCommands()
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
