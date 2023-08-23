export const formatSeconds = (seconds: number): string => {
	let formattedTime = ""

	seconds >= 3600 
	?
	// hh:mm:ss
	formattedTime = 
		new Date(seconds * 1000)
			.toISOString()
			.slice(11,19)
	:
	// mm:ss
	formattedTime = 
		new Date(seconds * 1000)
			.toISOString()
			.slice(14,19)
	
	return formattedTime
}