import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from 'discord.js'
import { Client, Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { Category } from '@discordx/utilities'
import { injectable } from 'tsyringe'

import { MusicManager } from '../../services/musicPlayer.js'
import { DiscordUtils } from '../../utils/utils.js'
import { Pagination } from '@discordx/pagination'


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
		private musicManager: MusicManager
	) {}

    @Slash({
        name: 'play',
        description: 'Play / add a song or playlist from url. Search and play a song if it is not a valid url.'
    })
    async play(
        @SlashOption({
            description: 'song url or title',
            name: 'song',
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        songName: string,
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            await this.musicManager.player.play(voiceChannel, songName)
            const queue = this.musicManager.player.getQueue(interaction.guildId)
            await DiscordUtils.replyOrFollowUp(interaction, `> Now playing: **${queue?.songs[0].name}**`)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    @Slash({
        name: 'stop',
        description: 'Stops music'
    })
    async stop(
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            await this.musicManager.player.stop(interaction.guildId)
            const queue = this.musicManager.player.getQueue(interaction.guildId)
            await DiscordUtils.replyOrFollowUp(interaction, `> Stopped music: **${queue?.songs[0].name}**`)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    @Slash({
        name: 'pause',
        description: 'Pause the guild stream'
    })
    async pause(
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            this.musicManager.player.pause(interaction.guildId)
            const queue = this.musicManager.player.getQueue(interaction.guildId)
            await DiscordUtils.replyOrFollowUp(interaction, `> Paused music: **${queue?.songs[0].name}**`)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    @Slash({
        name: 'resume',
        description: 'Resume the guild stream'
    })
    async resume(
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            this.musicManager.player.resume(interaction.guildId!)
            const queue = this.musicManager.player.getQueue(interaction.guildId)
            await DiscordUtils.replyOrFollowUp(interaction, `> Resumed music: **${queue?.songs[0].name}**`)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    @Slash({
        name: 'queue',
        description: 'Get the guild queue'
    })
    async getQueue(
        interaction: CommandInteraction, client: Client
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            const queue = this.musicManager.player.getQueue(interaction.guildId!)
            if(!queue) return

            const me = interaction?.guild?.members?.me ?? interaction.user

            const pages = queue.songs.map((song, i) => {
                const embed = new EmbedBuilder()
                .setTitle(`**${interaction.guild?.name}**`)
                .setDescription(`Music queue for **${queue.voiceChannel?.name}**`)
                .setAuthor({
                    name: client.user!.username,
                    iconURL: me.displayAvatarURL()
                })
                .setTimestamp()
                .setFooter({ text: `Page ${i + 1} of ${queue?.songs.length}` })
                .setThumbnail(`${song.thumbnail}`)
                .addFields({
                    name: '**name**',
                    value: `[${song.name}](${song.url})`
                })
                .addFields({
                    name: '**uploader**',
                    value: `[${song.uploader.name}](${song.uploader.url})`
                })
                .addFields({
                    name: '**download**',
                    value: `[click](${song.streamURL})`
                })
                .addFields({
                    name: '**source**',
                    value: `${song.source}`
                })
                .addFields({
                    name: '**duration (seconds/formatted)**',
                    value: `${song.duration} / ${song.formattedDuration}`
                })
      
                return { embeds: [embed] }
            })
            

            const pagination = new Pagination(interaction, pages)
            await pagination.send()
            await DiscordUtils.replyOrFollowUp(interaction, `> Getting queue`)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    @Slash({
        name: 'volume',
        description: `Set the guild stream's volume`
    })
    async setVolume(
        @SlashOption({
            description: 'percent of volume',
            name: 'volume',
            required: true,
            type: ApplicationCommandOptionType.Number,
        })
        percent: number,
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return
            
            this.musicManager.player.setVolume(interaction.guildId, percent)
            await DiscordUtils.replyOrFollowUp(interaction, `> Volume changed to: **${percent}%**`)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    @Slash({
        name: 'related',
        description: 'Add related song to the queue'
    })
    async addRelatedSong(
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            const song = await this.musicManager.player.addRelatedSong(interaction.guildId)
            await DiscordUtils.replyOrFollowUp(interaction, `> Added related song to queue: **${song.name}**`)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    @Slash({
        name: 'jump',
        description: 'Jump to the song number in the queue. The next one is 1, 2,... The previous one is -1, -2,...'
    })
    async jump(
        @SlashOption({
            description: 'Jump to the song number in the queue. The next one is 1, 2,... The previous one is -1, -2,...',
            name: 'num',
            required: true,
            type: ApplicationCommandOptionType.Number,
        })
        num: number,
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            const song = await this.musicManager.player.jump(interaction.guildId, num)
            await DiscordUtils.replyOrFollowUp(interaction, `> Jumped to song: **${song.name}**`)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    @Slash({
        name: 'previous',
        description: 'Play the previous song'
    })
    async previous(
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            const song = await this.musicManager.player.previous(interaction.guildId)
            await DiscordUtils.replyOrFollowUp(interaction, `> Playing previous song: **${song.name}**`)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    @Slash({
        name: 'search',
        description: 'Search for a song'
    })
    async search(
        @SlashOption({
            description: 'Search query to find songs',
            name: 'query',
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        query: string,
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            const results = await this.musicManager.player.search(query)
            await DiscordUtils.replyOrFollowUp(interaction, `> Search results`)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    @Slash({
        name: 'seek',
        description: 'Set the playing time to another position'
    })
    async seek(
        @SlashOption({
            description: 'Time to seek in song',
            name: 'time',
            required: true,
            type: ApplicationCommandOptionType.Number,
        })
        time: number,
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            const queue = this.musicManager.player.seek(interaction.guildId, time)
            await DiscordUtils.replyOrFollowUp(interaction, `> Seeked to time ${queue.currentTime}: **${queue.songs[0].name}**`)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    @Slash({
        name: 'repeat',
        description: 'Set the repeat mode of the guild queue'
    })
    async setRepeatMode(
        @SlashOption({
            description: 'Repeat mode. 1 - song, 2 - queue, empty - off',
            name: 'mode',
            required: false,
            type: ApplicationCommandOptionType.Number,
            minValue: 1,
            maxValue: 2
        })
        mode: number,
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            const repeatMode = this.musicManager.player.setRepeatMode(interaction.guildId, mode)
            const finalMode = repeatMode ? repeatMode == 2 ? 'Repeat queue' : 'Repeat song' : 'Off'

            await DiscordUtils.replyOrFollowUp(
                interaction, `> Repeat mode set to **${finalMode}**`
            )
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    @Slash({
        name: 'shuffle',
        description: 'Shuffle the guild queue songs'
    })
    async shuffle(
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            const queue = await this.musicManager.player.shuffle(interaction.guildId)
            await DiscordUtils.replyOrFollowUp(interaction, `> Queue shuffled`)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    @Slash({
        name: 'skip',
        description: 'Skip the playing song if there is a next song in the queue.'
    })
    async skip(
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            const song = await this.musicManager.player.skip(interaction.guildId)
            await DiscordUtils.replyOrFollowUp(interaction, `> Song skipped. Playing: **${song.name}**`)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    @Slash({
        name: 'autoplay',
        description: 'Toggle autoplay mode'
    })
    async toggleAutoplay(
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            const autoplay = this.musicManager.player.toggleAutoplay(interaction.guildId)
            await DiscordUtils.replyOrFollowUp(interaction, `> Autoplay: **${autoplay ? 'ON' : 'OFF'}**`)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }
    
}