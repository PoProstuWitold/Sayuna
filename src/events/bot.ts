import { type Client, Discord, Once } from 'discordx'

import { globalConfig } from '../config.js'
import { type CustomLogger, logger } from '../services/logger.service.js'
import { type MusicManager, musicManager } from '../services/music.service.js'

@Discord()
export class Bot {
	private logger: CustomLogger = logger
	private musicManager: MusicManager = musicManager

	@Once({
		event: 'ready'
	})
	async ready([client]: [Client]) {
		try {
			const botId = globalConfig.client.botId
			if (client.user) {
				client.user.setActivity(globalConfig.config.activity.name, {
					type: globalConfig.config.activity.type
				})
			}

			// DEV MODE
			if (
				process.env.NODE_ENV === 'development' &&
				process.env.DEV_GUILD_ID
			) {
				this.logger.warn('Development mode')
				await client.clearApplicationCommands()
				if (process.env.DEV_GUILD_ID) {
					await client.clearApplicationCommands(
						process.env.DEV_GUILD_ID
					)
				}
				await client.initApplicationCommands()
			}

			// PRODUCTION MODE
			if (process.env.NODE_ENV === 'production') {
				this.logger.warn('Production mode')
				await client.clearApplicationCommands()
				await client.initApplicationCommands()
			}

			this.musicManager.listen()
			this.logger.info(
				botId ? `Bot "${botId}" started. GLHF!` : 'Bot started. GLHF!'
			)
		} catch (err) {
			this.logger.error(err)
			client.destroy()
		}
	}
}
