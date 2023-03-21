//@ts-nocheck
import { inject, singleton } from 'tsyringe'
import { DisTube, Playlist, Queue, SearchResult, Song } from 'distube'
import { YtDlpPlugin } from '@distube/yt-dlp'
import { SoundCloudPlugin } from '@distube/soundcloud'
import { SpotifyPlugin } from '@distube/spotify'

import { CustomLogger } from './logger.service.js'
import { GuildTextBasedChannel, Message } from 'discord.js'
import type { MusicPlayerOptions } from '../utils/types.js'

@singleton()
export class MusicManager {
    public readonly player: DisTube

    public constructor(
        @inject('musicOpts') public opts: MusicPlayerOptions,
        private logger: CustomLogger
    ) {
        this.player = new DisTube(this.opts.client, {
            emitNewSongOnly: true,
    		emitAddSongWhenCreatingQueue: true,
    		emitAddListWhenCreatingQueue: true,
    		leaveOnEmpty: true,
    		leaveOnFinish: true,
    		leaveOnStop: true,
    		savePreviousSongs: true,
    		searchSongs: 0,
    		nsfw: true,
    		ytdlOptions: {
    			filter: 'audioonly',
    			highWaterMark: 1024 * 1024 * 64,
    			quality: 'highestaudio',
    			liveBuffer: 60000,
    			dlChunkSize: 1024 * 1024 * 64,
    		},
    		plugins: [
                new YtDlpPlugin({
                    update: true
                }),
                new SpotifyPlugin(),
                new SoundCloudPlugin()
            ]
        })
    }

    async start() {
        this.logger.info('Music player is working...')
    }

    async listen() {
        this.logger.info('Music player is listening to events...')
        this.player.setMaxListeners(50)
        this.player
            .on('addList', async (queue: Queue, playlist: Playlist<unknown>) => {
                this.logger.info(`Added playlist! Playlist Name: ${playlist.name} | Queue length: ${queue.songs.length}`)
            })
            .on('addSong', async (queue: Queue, song: Song<unknown>) => {
                this.logger.info(`Added song! Song name: ${song.name} | Queue length: ${queue.songs.length}`)
            })
            .on('deleteQueue', async (queue: Queue) => {
                this.logger.info(`Deleted queue! Voice Channel: ${queue.voiceChannel?.name} | Guild: ${queue.textChannel?.guild.name}`)
            })
            .on('disconnect', async (queue: Queue) => {
                this.logger.info(`Disconnected! Voice Channel: ${queue.voiceChannel?.name} | Guild: ${queue.textChannel?.guild.name}`)
            })
            .on('empty', async (queue: Queue) => {
                this.logger.info(`Channel Empty! Voice Channel: ${queue.voiceChannel?.name} | Guild: ${queue.textChannel?.guild.name}`)
            })
            .on('error', async (channel: GuildTextBasedChannel | undefined, error: Error) => {
                this.logger.error(`Error! Channel: ${channel?.name}`)
                this.logger.error(error)
            })
            .on('finish', async (queue: Queue) => {
                this.logger.info(`Queue finished! Voice Channel: ${queue.voiceChannel?.name} | Guild: ${queue.textChannel?.guild.name} `)
            })
            .on('finishSong', async (queue: Queue, song: Song<unknown>) => {
                this.logger.info(`Song finished! Song: ${song.name} Voice Channel: ${queue.voiceChannel?.name} | Guild: ${queue.textChannel?.guild.name} `)
            })
            .on('initQueue', async (queue: Queue) => {
                this.logger.info(`Queue initialized! Voice Channel: ${queue.voiceChannel?.name} | Guild: ${queue.textChannel?.guild.name} `)
            })
            .on('noRelated', async (queue: Queue) => {
                this.logger.info(`No related? Voice Channel: ${queue.voiceChannel?.name} | Guild: ${queue.textChannel?.guild.name} `)
            })
            .on('playSong', async (queue: Queue, song: Song) => {
                this.logger.info(`Playing song! Name: ${song.name} | Queue length: ${queue.songs.length}`)
            })
            .on('searchCancel', async (message: Message<true>, query: string) => {
                this.logger.info(`Search canceled!`)
            })
            .on('searchDone', async(message: Message<true>, answer: Message<true>, query: string) => {
                this.logger.info(`Search done!`)
            })
            .on('searchInvalidAnswer', async(message: Message<true>, answer: Message<true>, query: string) => {
                this.logger.info(`Invalid search answer!`)
            })
            .on('searchNoResult', async(message: Message<true>, query: string) => {
                this.logger.info(`No search results!`)
            })
            .on('searchResult', async(message: Message<true>, results: SearchResult[], query: string) => {
                this.logger.info(`Got search results!`)
            })
    }

}