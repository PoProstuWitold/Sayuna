import { ActivityType } from 'discord.js'

export const formatSeconds = (seconds: number): string => {
	let formattedTime = ''

	seconds >= 3600
		? // hh:mm:ss
			(formattedTime = new Date(seconds * 1000)
				.toISOString()
				.slice(11, 19))
		: // mm:ss
			(formattedTime = new Date(seconds * 1000)
				.toISOString()
				.slice(14, 19))

	return formattedTime
}

export const getActivityType = (type?: string): number => {
	if (!type) return ActivityType.Streaming
	
	switch (type) {
		case 'PLAYING':
			return ActivityType.Playing
		case 'STREAMING':
			return ActivityType.Streaming
		case 'LISTENING':
			return ActivityType.Listening
		case 'WATCHING':
			return ActivityType.Watching
		case 'COMPETING':
			return ActivityType.Competing
		case 'CUSTOM':
			return ActivityType.Custom
		default:
			return ActivityType.Playing
	}
}