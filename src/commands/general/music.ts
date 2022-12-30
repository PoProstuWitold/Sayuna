import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { Category } from '@discordx/utilities'
import { delay, inject, injectable } from 'tsyringe'

import { MusicManager } from '../../services/musicPlayer.js'
import { DiscordUtils } from '../../utils/utils.js'


@Discord()
@Category('music')
@SlashGroup({ 
    name: 'music', 
    description: 'Everything related to music'
})
@SlashGroup('music')
@injectable()
export class Dev {

    constructor(
		@inject(delay(() => MusicManager)) private musicManager?: MusicManager
	) {}

    @Slash({
        name: 'play',
        description: 'Play music'
    })
    async play(
        @SlashOption({
            description: "song url or title",
            name: "song",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        songName: string,
        interaction: CommandInteraction
    ): Promise<void> {
        const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
        
        if(!voiceChannel) return

        await this.musicManager?.player.play(voiceChannel, songName)
        const queue = this.musicManager?.player.getQueue(interaction.guildId!)
        await DiscordUtils.replyOrFollowUp(interaction, `Now playing: "${queue?.songs[0].name}"`)
    }
}