import { DeezerPlugin } from '@distube/deezer'
import { DirectLinkPlugin } from '@distube/direct-link'
import { SoundCloudPlugin } from '@distube/soundcloud'
import { SpotifyPlugin } from '@distube/spotify'
import { YouTubePlugin } from '@distube/youtube'
import type { Client } from 'discordx'
import { DisTube, Events } from 'distube'

import { globalConfig } from '../config.js'
import { DiscordUtils } from '../utils/discord.utils.js'
import { type CustomLogger, logger } from './logger.service.js'

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
			nsfw: false,
			plugins: [
				this.ytPlugin,
				new SpotifyPlugin({
					api: {
						topTracksCountry: 'PL',
						clientId: process.env.SPOTIFY_CLIENT_ID,
						clientSecret: process.env.SPOTIFY_CLIENT_SECRET
					}
				}),
				new SoundCloudPlugin(),
				new DirectLinkPlugin(),
				new DeezerPlugin()
			]
		})
	}

	async listen() {
		this.logger.info('Music player is listening to events...')
		this.player.setMaxListeners(100)

		this.player.on(Events.ADD_LIST, (queue, playlist) => {
			this.logger.info(
				`Playlist ${playlist.name} has been added to queue ${queue.id}`
			)
		})
		this.player.on(Events.ADD_SONG, (queue, song) => {
			this.logger.info(
				`Song ${song.name} has been added to queue ${queue.id}`
			)
		})
		this.player.on(Events.DEBUG, (debug) => {
			process.env.NODE_ENV === 'development' ||
			process.env.DEBUG_LOGS === 'true'
				? this.logger.log(debug)
				: null
		})
		this.player.on(Events.DELETE_QUEUE, (queue) => {
			this.logger.info(`Queue ${queue.id} has been deleted`)
			queue.voice.leave()
		})
		this.player.on(Events.DISCONNECT, (queue) => {
			this.logger.info(`Queue ${queue.id} has been disconnected`)
		})
		this.player.on(Events.ERROR, async (error, _queue, song) => {
			this.logger.error(error)
			// @ts-expect-error
			const interaction = song?.metadata?.interaction
			if (!interaction) return

			await DiscordUtils.handleInteractionError(interaction, error)
		})
		this.player.on(Events.FFMPEG_DEBUG, (debug) => {
			process.env.NODE_ENV === 'development' ||
			process.env.DEBUG_LOGS === 'true'
				? this.logger.log(debug)
				: null
		})
		this.player.on(Events.FINISH, (queue) => {
			this.logger.info(`Queue ${queue.id} has finished playing`)
			queue.voice.leave()
		})
		this.player.on(Events.FINISH_SONG, (queue, song) => {
			this.logger.info(
				`Song ${song.name} has finished playing in queue ${queue.id}`
			)
		})
		this.player.on(Events.INIT_QUEUE, (queue) => {
			this.logger.info(`Queue ${queue.id} has been initialized`)
		})
		this.player.on(Events.NO_RELATED, (queue, error) => {
			this.logger.error(queue, error)
		})
		this.player.on(Events.PLAY_SONG, (queue, song) => {
			this.logger.info(
				`Song ${song.name} is now playing in queue ${queue.id}`
			)
		})
	}
}

export const musicManager = new MusicManager()
