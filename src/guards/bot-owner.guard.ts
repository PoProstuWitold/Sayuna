import { CommandInteraction } from 'discord.js'
import {Client, Next} from 'discordx'

import { DiscordUtils } from '../utils/discord.utils.js'


export const BotOwner = (interaction: CommandInteraction, _client: Client, next: Next): Promise<unknown> => {
    const userId = interaction.user.id
    if (userId !== process.env.OWNER_ID) {
        return DiscordUtils.replyOrFollowUp(interaction, '> **Unauthorised**: Only bot owner may use this command')
    }
    return next()
}