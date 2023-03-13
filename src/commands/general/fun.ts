import { CommandInteraction, EmbedBuilder } from 'discord.js'
import { Discord, Slash, SlashGroup } from 'discordx'
import { Category } from '@discordx/utilities'

import { DiscordUtils } from '../../utils/discordUtils.js'
import { BaseError } from '../../exceptions/base.exception.js'
import { UtilService } from '../../services/utilService.js'


interface MemeJson {
    postLink: string
    subreddit: string
    title: string
    url: string
    nsfw: boolean
    spoiler: boolean
    author: string
    ups: number
    preview: string[]
}

@Discord()
@Category('fun')
@SlashGroup({ 
    name: 'fun', 
    description: 'Commands for getting infos about different topics'
})
@SlashGroup('fun')
export class Fun {
    @Slash({
        name: 'meme',
        description: 'Get random meme from Reddit'
    })
    public async meme(interaction: CommandInteraction): Promise<void> {
        try {
            if(!interaction) throw Error('No interaction found')

            const randomSubreddit = UtilService.getRandomRecords<any>(['memes', 'programmerhumor', 'anbennar'], 1)

            const response = await fetch(`https://meme-api.com/gimme/${randomSubreddit}`)

            if(response.status !== 200) {
                throw new BaseError({
                    name: 'HTTP Error',
                    message: response.statusText,
                    status: response.status
                })
            }
            
            const memeJson: MemeJson = await response.json()

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