import { Discord, Guard, Slash, SlashGroup, SlashOption } from 'discordx'
import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from 'discord.js'
import { Pagination } from '@discordx/pagination'

import { globalConfig } from '../../config.js'
import { DiscordUtils } from '../../utils/discord.utils.js'
import { aiService, AiService } from '../../services/ai.service.js'
import { UtilService } from '../../services/util.service.js'
import { FeatureEnabled } from '../../guards/feature-enabled.guard.js'

@Discord()
@Category('ai')
@SlashGroup({ 
    name: 'ai', 
    description: `Commands related to artifactal intelligence such as OpenAI's API`
})
@SlashGroup('ai')
@Guard(
    FeatureEnabled({
		enabled: globalConfig.aiOptions.enabled,
		feature: 'AI',
		reason: 'ChatGPT pricing'
	})
)
export class Ai {
	private aiService: AiService = aiService

    @Slash({
        name: 'chat',
        description: 'Send message to chat bot'
    })
    public async chat(
        @SlashOption({
            description: 'prompt for chatbot',
            name: 'prompt',
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        prompt: string,
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            if(!interaction) throw Error('No interaction found')
            
            await interaction.deferReply()

            const me = interaction.user
            const res = await this.aiService.chat(`${me.id}: ${prompt}`)

            const slicesArray = await UtilService.splitLongString(res.text, 1000)
                    const resPages = slicesArray.map((partialResponseSlice, i) => {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: me.username,
                                iconURL: `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=256`
                            })
                            .setTitle(`Sayuna`)
                            .addFields({
                                name: 'Prompt',
                                value: `> ${prompt}`
                            })
                            .addFields({ 
                                name: 'Answer',
                                value: partialResponseSlice || '***something wrong, I can feel it***'
                            })
                            .setFooter({
                                text: `Page ${i + 1} of ${slicesArray.length} | ChatGPT API`
                            })
                            .setTimestamp()
        
                        return { embeds: [embed] }
                    })
                        
                    const pagination = new Pagination(interaction, resPages)

                    await pagination.send()
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }
}