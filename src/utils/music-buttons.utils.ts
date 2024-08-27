import { ButtonInteraction } from 'discord.js'
import { Discord } from 'discordx'
import { DisTubeError, Queue } from 'distube'

import { musicManager, MusicManager } from '../services/music.service.js'
import { DiscordUtils } from './discord.utils.js'
import { MusicUtils } from './music.utils.js'

@Discord()
export class MusicButtons {
	private musicManager: MusicManager = musicManager

    async pauseResume(interaction: ButtonInteraction) {
        try {
            if(!interaction.guildId) return
            let queue: Queue | undefined = this.musicManager.player.getQueue(interaction.guildId)
            if(!queue) throw new DisTubeError('NO_QUEUE')

            queue.paused ?
            this.musicManager.player.resume(interaction.guildId)
            :
            this.musicManager.player.pause(interaction.guildId)
            
            const me = interaction.guild?.members.me ?? interaction.user

            const currentEmbed = await MusicUtils.getCurrentSongEmbed(
                queue, interaction.client, me, interaction
            )
            if(!currentEmbed) throw Error('No current song embed!')

            await interaction.update({
                embeds: [
                    currentEmbed
                ]
            })
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    async skip(interaction: ButtonInteraction) {
        try {
            if(!interaction.guildId) return

            await this.musicManager.player.skip(interaction.guildId)

            // we need to wait because queue will return outdated songs
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            let queue: Queue | undefined = this.musicManager.player.getQueue(interaction.guildId)
            if(!queue) throw new DisTubeError('NO_QUEUE')
            
            const me = interaction.guild?.members.me ?? interaction.user

            const currentEmbed = await MusicUtils.getCurrentSongEmbed(
                queue, interaction.client, me, interaction
            )
            if(!currentEmbed) throw Error('No current song embed!')

            await interaction.update({
                embeds: [
                    currentEmbed
                ]
            })
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    async previous(interaction: ButtonInteraction) {
        try {
            if(!interaction.guildId) return

            await this.musicManager.player.previous(interaction.guildId)

            // we need to wait because queue will return outdated songs
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            let queue: Queue | undefined = this.musicManager.player.getQueue(interaction.guildId)
            if(!queue) throw new DisTubeError('NO_QUEUE')
            
            const me = interaction.guild?.members.me ?? interaction.user

            const currentEmbed = await MusicUtils.getCurrentSongEmbed(
                queue, interaction.client, me, interaction
            )
            if(!currentEmbed) throw Error('No current song embed!')

            await interaction.update({
                embeds: [
                    currentEmbed
                ]
            })
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    async stop(interaction: ButtonInteraction) {
        try {
            if(!interaction.guildId) return
            let queue: Queue | undefined = this.musicManager.player.getQueue(interaction.guildId)
            if(!queue) throw new DisTubeError('NO_QUEUE')

            this.musicManager.player.stop(interaction.guildId)
            
            const me = interaction.guild?.members.me ?? interaction.user

            const currentEmbed = await MusicUtils.getCurrentSongEmbed(
                queue, interaction.client, me, interaction
            )
            currentEmbed?.setTitle('**Queue stopped**')

            if(!currentEmbed) throw Error('No current song embed!')

            await interaction.update({
                embeds: [
                    currentEmbed
                ]
            })
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    async volumeUp(interaction: ButtonInteraction) {
        try {
            if(!interaction.guildId) return
            let queue: Queue | undefined = this.musicManager.player.getQueue(interaction.guildId)
            if(!queue) throw new DisTubeError('NO_QUEUE')
            
            this.musicManager.player.setVolume(interaction.guildId, queue.volume + 10)

            // we need to wait because queue will return outdated songs
            // await new Promise(resolve => setTimeout(resolve, 1000))
            
            queue = this.musicManager.player.getQueue(interaction.guildId)
            if(!queue) throw new DisTubeError('NO_QUEUE')
            
            const me = interaction.guild?.members.me ?? interaction.user

            const currentEmbed = await MusicUtils.getCurrentSongEmbed(
                queue, interaction.client, me, interaction
            )
            if(!currentEmbed) throw Error('No current song embed!')

            await interaction.update({
                embeds: [
                    currentEmbed
                ]
            })
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

    async volumeDown(interaction: ButtonInteraction) {
        try {
            if(!interaction.guildId) return
            let queue: Queue | undefined = this.musicManager.player.getQueue(interaction.guildId)
            if(!queue) throw new DisTubeError('NO_QUEUE')
            
            this.musicManager.player.setVolume(interaction.guildId, queue.volume - 10)

            // we need to wait because queue will return outdated songs
            // await new Promise(resolve => setTimeout(resolve, 1000))
            
            queue = this.musicManager.player.getQueue(interaction.guildId)
            if(!queue) throw new DisTubeError('NO_QUEUE')
            
            const me = interaction.guild?.members.me ?? interaction.user

            const currentEmbed = await MusicUtils.getCurrentSongEmbed(
                queue, interaction.client, me, interaction
            )
            if(!currentEmbed) throw Error('No current song embed!')

            await interaction.update({
                embeds: [
                    currentEmbed
                ]
            })
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }
}

export const musicButtons = new MusicButtons()