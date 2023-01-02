import { 
    ApplicationCommandOptionType, CommandInteraction, 
    EmbedBuilder, GuildMember 
} from 'discord.js'
import { Client, Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { Pagination } from '@discordx/pagination'
import { Category } from '@discordx/utilities'
import { injectable } from 'tsyringe'
import { DisTubeError, Queue } from 'distube'

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
		private musicManager: MusicManager
	) {}

    @Slash({
        name: 'play',
        description: 'Play / add a song or playlist from url. Search and play a song if it is not a valid url.'
    })
    async play(
        @SlashOption({
            description: 'song / playlist search query or url',
            name: 'music',
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

            const member: GuildMember = (interaction.member ? interaction.member : interaction!.guild!.members!.me) as GuildMember

            await this.musicManager.player.play(voiceChannel, songName, {
                member: member
            })

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
            
            const queue = this.musicManager.player.getQueue(interaction.guildId)
            if(!queue) throw new DisTubeError('NO_QUEUE')

            const song = queue.songs[0]

            await this.musicManager.player.stop(interaction.guildId)
            await DiscordUtils.replyOrFollowUp(interaction, `> Stopped music: **${song.name}**`)
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
            if(!queue) throw new DisTubeError('NO_QUEUE')

            await this.paginateQueue(interaction, client, queue)
            
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
            await DiscordUtils.replyOrFollowUp(interaction, `> Queue shuffled: **${queue.voiceChannel?.guild.name} | ${queue.voiceChannel?.name}**`)
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

    @Slash({
        name: 'current',
        description: 'Display current song and queue'
    })
    async currentSong(
        interaction: CommandInteraction, client: Client
    ): Promise<void> {
        try {
            const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction)
            if(!voiceChannel) return
            if(!interaction.guildId) return

            const queue: Queue | undefined = this.musicManager.player.getQueue(interaction.guildId)
            if(!queue) throw new DisTubeError('NO_QUEUE')

			let nextSong: string | undefined
			let previousSong: string | undefined

            queue.songs[1] ? nextSong = queue.songs[1].name : nextSong = 'No next song'
			queue.previousSongs[0] ? previousSong = queue.previousSongs[queue.previousSongs.length - 1].name : previousSong = 'No previous song'
            const me = interaction?.guild?.members?.me ?? interaction.user

            const currentEmbed = new EmbedBuilder()
                .setTitle(`**${queue.paused ? '⏸ Paused' : '▶ Playing'}**`)
                .setDescription(`[${queue.songs[0].name}](${queue.songs[0].url})`)
                .setAuthor({
                    name: client.user!.username,
                    iconURL: me.displayAvatarURL()
                })
                .setTimestamp()
                .setFooter({ text: `${queue.voiceChannel?.guild.name} | ${queue.voiceChannel?.name}` })
                .setThumbnail(`${queue.songs[0].thumbnail}`)
                .addFields({
                    name: 'Requested by',
                    value: `<@${queue?.songs[0].user?.id}>`,
                    inline: true
                })
                .addFields({
                    name: 'Duration',
                    value: `${queue.songs[0].formattedDuration}`,
                    inline: true
                })
                .addFields({
                    name: 'Queue',
                    value: `${queue.songs.length} song(s) - ${queue.formattedDuration}`,
                    inline: true
                })
                .addFields({
                    name: 'Volume',
                    value: `${queue.volume}%`,
                    inline: true
                })
                .addFields({
                    name: 'Loop',
                    value: `${queue.repeatMode ? queue.repeatMode == 2 ? 'Repeat queue' : 'Repeat song' : 'Off'}`,
                    inline: true
                })
                .addFields({
                    name: 'Autoplay',
                    value: `${queue.autoplay ? 'On' : 'Off'}`,
                    inline: true
                })
                .addFields({
                    name: 'Next',
                    value: `${nextSong}`,
                    inline: true
                })
                .addFields({
                    name: 'Previous',
                    value: `${previousSong}`,
                    inline: true
                })
                .addFields({
                    name: 'Links',
                    value: `[download](${queue.songs[0].streamURL})`
                })

            await DiscordUtils.replyOrFollowUp(interaction, {
                embeds: [currentEmbed]
            })
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    private async paginateQueue(interaction: CommandInteraction, client: Client, queue: Queue) {
        const songs: any[] = []
            queue.songs.map((song, i) => songs.push({
                name: `${i + 1}. ${song.name}`,
                value: `[url](${song.url}) | [download](${song.streamURL})`
            }))

            let slicesArray = []
            while (songs.length > 0) {
                slicesArray.push(songs.splice(0,10))
            }

            const me = interaction?.guild?.members?.me ?? interaction.user

            const titlePages = slicesArray.map((songChunk, i) => {
                const embed = new EmbedBuilder()
                .setTitle(`**${interaction.guild?.name}**`)
                .setDescription(`Music queue for **${queue.voiceChannel?.name}**`)
                .setAuthor({
                    name: client.user!.username,
                    iconURL: me.displayAvatarURL()
                })
                .setTimestamp()
                .setFooter({ text: `Page ${i + 1} of ${queue.songs.length + slicesArray.length} | Songs starts at page ${slicesArray.length + 1}` })
                .addFields(songChunk)

                return { embeds: [embed] }
            })
            

            const pages = queue.songs.map((song, i) => {
                const embed = new EmbedBuilder()
                .setTitle(`**${interaction.guild?.name}**`)
                .setDescription(`Music queue for **${queue.voiceChannel?.name}**`)
                .setAuthor({
                    name: client.user!.username,
                    iconURL: me.displayAvatarURL()
                })
                .setTimestamp()
                .setFooter({ text: `Page ${slicesArray.length + i + 1} of ${queue.songs.length + slicesArray.length} | Song ${i + 1} of ${queue.songs.length}` })
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

            const pagination = new Pagination(interaction, titlePages.concat(...pages))
            await pagination.send()
    }
    
}