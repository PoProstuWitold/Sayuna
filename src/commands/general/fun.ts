import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { Category } from '@discordx/utilities'

import { DiscordUtils } from '../../utils/discord.utils.js'
import { BaseError } from '../../exceptions/base.exception.js'
import { UtilService } from '../../services/util.service.js'
import { MemeJson } from '../../utils/types.js'


@Discord()
@Category('fun')
@SlashGroup({ 
    name: 'fun', 
    description: 'Commands for getting infos about different topics'
})
@SlashGroup('fun')
export class Fun {
    @Slash({
        name: 'reddit',
        description: 'Get random meme from Reddit'
    })
    public async randomRedditMeme(
        @SlashOption({
            description: 'Your subreddit name',
            name: 'subreddit',
            required: false,
            type: ApplicationCommandOptionType.String,
        })
        subReddit: string,
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            if(!interaction) throw Error('No interaction found')

            const randomSubreddit = subReddit ? subReddit :
            UtilService.getRandomRecords<string>(['memes', 'programmerhumor', 'anbennar'], 1)

            const response = await fetch(`https://meme-api.com/gimme/${randomSubreddit}`)

            const baseErrorValues = {
                name: 'HTTP Error',
                status: response.status,
            }

            if(response.status !== 200 && !subReddit) {
                throw new BaseError({
                    ...baseErrorValues,
                    message: response.statusText,
                })
            }

            if(response.status !== 200) {
                throw new BaseError({
                    ...baseErrorValues,
                    message: `Provided subreddit doesn't exist`
                })
            }
            
			const memeJson: MemeJson = await response.json() as MemeJson;

            const memeEmbed = new EmbedBuilder()
                .setTitle(`**${memeJson.title}**`)
                .setDescription(`r/${memeJson.subreddit}`)
                .setAuthor({
                    name: memeJson.author
                })
                .setTimestamp()
                .addFields({
                    name: 'NSFW',
                    value: `${memeJson.nsfw}`,
                    inline: true
                })
                .addFields({
                    name: 'SPOILER',
                    value: `${memeJson.spoiler}`,
                    inline: true
                })
                .addFields({
                    name: 'score/upvotes',
                    value: `${memeJson.ups}`,
                    inline: true
                })
                .setImage(memeJson.url)

            await DiscordUtils.replyOrFollowUp(interaction, {
                embeds: [memeEmbed]
            })
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }
}