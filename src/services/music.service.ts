import { DisTube, Events } from 'distube'
import { Client } from 'discordx'
import { SoundCloudPlugin } from '@distube/soundcloud'
import { SpotifyPlugin } from '@distube/spotify'
import { YouTubePlugin } from '@distube/youtube'
import { YtDlpPlugin } from '@distube/yt-dlp'
import { DirectLinkPlugin } from '@distube/direct-link'
import { DeezerPlugin } from '@distube/deezer'

import { globalConfig } from '../config.js'
import { CustomLogger, logger } from './logger.service.js'

export class MusicManager {
    public readonly player: DisTube
	public readonly ytPlugin: YouTubePlugin
	private client: Client = globalConfig.client
	private logger: CustomLogger = logger

    constructor() {
		this.ytPlugin = new YouTubePlugin()
        this.player = new DisTube(this.client, {
            emitNewSongOnly: true,
    		emitAddSongWhenCreatingQueue: true,
    		emitAddListWhenCreatingQueue: true,
    		savePreviousSongs: true,
    		nsfw: true,
    		plugins: [
                this.ytPlugin,
                new SpotifyPlugin(),
                new SoundCloudPlugin(),
				new DirectLinkPlugin(),
				new DeezerPlugin(),
				new YtDlpPlugin({
					update: true
				})
            ]
        })
    }

    async listen() {
        this.logger.info('Music player is listening to events...')
        this.player.setMaxListeners(50)

		this.player.on(Events.ADD_LIST, (queue, playlist) => {
			this.logger.info(`Playlist ${playlist.name} has been added to queue ${queue.id}`)
		})
		this.player.on(Events.ADD_SONG, (queue, song) => {
			this.logger.info(`Song ${song.name} has been added to queue ${queue.id}`)
		})
		this.player.on(Events.DEBUG, (debug) => {
			process.env.NODE_ENV === 'development' || process.env.LOG_EVERYTHING === 'true' 
			? this.logger.log(debug) : null
		})
		this.player.on(Events.DELETE_QUEUE, (queue) => {
			this.logger.info(`Queue ${queue.id} has been deleted`)
			queue.voice.leave()
		})
		this.player.on(Events.DISCONNECT, (queue) => {
			this.logger.info(`Queue ${queue.id} has been disconnected`)
		})
		this.player.on(Events.ERROR, (error, queue, song) => {
			this.logger.error(error)
		})
		this.player.on(Events.FFMPEG_DEBUG, (debug) => {
			process.env.NODE_ENV === 'development' || process.env.LOG_EVERYTHING === 'true' 
			? this.logger.log(debug) : null
		})
		this.player.on(Events.FINISH, (queue) => {
			this.logger.info(`Queue ${queue.id} has finished playing`)
			queue.voice.leave()
		})
		this.player.on(Events.FINISH_SONG, (queue, song) => {
			this.logger.info(`Song ${song.name} has finished playing in queue ${queue.id}`)
		})
		this.player.on(Events.INIT_QUEUE, (queue) => {
			this.logger.info(`Queue ${queue.id} has been initialized`)
		})
		this.player.on(Events.NO_RELATED, (queue, error) => {
			this.logger.error(queue, error)
		})
		this.player.on(Events.PLAY_SONG, (queue, song) => {
			this.logger.info(`Song ${song.name} is now playing in queue ${queue.id}`)
		})
    }
}

export const musicManager = new MusicManager()