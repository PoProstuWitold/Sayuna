import { CommandInteraction } from 'discord.js'
import { Client, GuardFunction, Next } from 'discordx'

import { DiscordUtils } from '../utils/discord.utils.js'

export function FeatureEnabled(feature: string, enabled: boolean) {
    const guard: GuardFunction<
        CommandInteraction
    > = async (interaction: CommandInteraction, _client: Client, next: Next) => {
        if (!enabled) {
            return DiscordUtils.replyOrFollowUp(
                interaction, 
                `> **Feature Disabled**: Feature *${feature}* is disabled for your guild`
            )
        }
        return next()
    }
  
    return guard
}