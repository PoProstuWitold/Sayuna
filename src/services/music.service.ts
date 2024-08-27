import { DisTube } from 'distube'
import { Client } from 'discordx'
import { SoundCloudPlugin } from '@distube/soundcloud'
import { SpotifyPlugin } from '@distube/spotify'
import { YouTubePlugin } from '@distube/youtube'

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
                new SoundCloudPlugin()
            ]
        })
    }

    async listen() {
        this.logger.info('Music player is listening to events...')
        this.player.setMaxListeners(50)
    }
}

export const musicManager = new MusicManager()