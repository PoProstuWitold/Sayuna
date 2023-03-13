import { CommandInteraction } from 'discord.js'
import {Client, Next} from 'discordx'

import { DiscordUtils } from '../utils/discord.utils.js'


export const BotOwner = (arg: CommandInteraction, client: Client, next: Next): Promise<unknown> => {
    const userId = arg.user.id
    if (userId !== process.env.OWNER_ID) {
        return DiscordUtils.replyOrFollowUp(arg, 'Unauthorised. Only bot owner may use this command')
    }
    return next()
}