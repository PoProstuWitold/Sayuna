import { CommandInteraction } from 'discord.js'
import { Client, GuardFunction, Next } from 'discordx'

import { DiscordUtils } from '../utils/discord.utils.js'
import { FeatureEnabledGuardOptions } from '../utils/types.js'

export function FeatureEnabled(opts: FeatureEnabledGuardOptions) {
    const guard: GuardFunction<
        CommandInteraction
    > = async (interaction: CommandInteraction, _client: Client, next: Next) => {
        if (!opts.enabled) {
            return DiscordUtils.replyOrFollowUp(
                interaction, 
                `> **Feature Disabled**: Feature \`\`${opts.feature}\`\` is disabled for your guild. ${opts.reason ? `\n> **Reason**: ${opts.reason}` : ``}`
            )
        }
        return next()
    }
  
    return guard
}