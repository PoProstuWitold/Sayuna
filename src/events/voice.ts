import type { ArgsOf } from 'discordx'
import { Discord, On } from 'discordx'
import { isVoiceChannelEmpty } from 'distube'

import { type CustomLogger, logger } from '../services/logger.service.js'
import { type MusicManager, musicManager } from '../services/music.service.js'

@Discord()
export class Voice {
	private logger: CustomLogger = logger
	private musicManager: MusicManager = musicManager

	// Leave the voice channel if there is no user in it
	@On({
		event: 'voiceStateUpdate'
	})
	async leaveEmptyChannel([
		oldState
	]: ArgsOf<'voiceStateUpdate'>): Promise<void> {
		try {
			if (!oldState.channel) return
			const voice = this.musicManager.player.voices.get(oldState)

			if (voice && isVoiceChannelEmpty(oldState)) {
				voice.leave()
			}
		} catch (err) {
			this.logger.error(err)
		}
	}
}
