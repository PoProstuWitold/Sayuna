import { ActivityType } from 'discord.js'
import type { ArgsOf, Client } from 'discordx'
import { Discord, On } from 'discordx'
import logger from '../utils/logger.js'

@Discord()
export abstract class Bot {
	@On({
        event: 'ready'
    })
    async ready([]: ArgsOf<'ready'>, client: Client) {
        try {
            //@ts-ignore
            const botId = client.options.botId
            client.user?.setActivity('Heroes 3', {type: ActivityType.Playing})
            // await client.clearApplicationCommands()
            await client.initApplicationCommands()
            logger.info(botId ? `Bot ${botId} started! GLHF!` : 'Bot started! GLHF!')
        } catch (err) {
            logger.error(err)
            client.destroy()
        }
    }
}
