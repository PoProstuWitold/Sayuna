import { Pagination } from '@discordx/pagination'
import { 
    ButtonInteraction,
    Client,
    CommandInteraction, EmbedBuilder, GuildMember, User
} from 'discord.js'
import { Queue } from 'distube'

import { DiscordUtils } from './discord.utils.js'


export class MusicUtils {
    public static async getCurrentSongEmbed(
        queue: Queue, client: Client, me: GuildMember | User,
        interaction: CommandInteraction | ButtonInteraction
    ) {
        try {
			let nextSong: string | undefined
			let previousSong: string | undefined

            queue.songs[1] ? nextSong = queue?.songs[1].name : nextSong = 'No next song'
			queue.previousSongs[0] ? previousSong = queue?.previousSongs[queue?.previousSongs.length - 1].name : previousSong = 'No previous song'

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
                    name: 'Current duration',
                    value: `${queue.formattedCurrentTime}`,
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
                    name: 'Previous',
                    value: `${previousSong}`,
                    inline: true
                })
                .addFields({
                    name: 'Next',
                    value: `${nextSong}`,
                    inline: true
                })
                .addFields({
                    name: 'Requested by',
                    value: `<@${queue?.songs[0].user?.id}>`,
                    inline: true
                })
            return currentEmbed
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    public static async paginateQueue(interaction: CommandInteraction, client: Client, queue: Queue) {
        const songs: any[] = []
            queue.songs.map((song, i) => {
				songs.push({
					name: `${i + 1}. ${song.name}`,
					value: `duration: ${song.formattedDuration}`
				})
			})

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