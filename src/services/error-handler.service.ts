import { type CustomLogger, logger } from './logger.service.js'

export class ErrorHandler {
	private logger: CustomLogger = logger
	constructor() {
		process.on('uncaughtException', (error: Error, origin: string) => {
			if (origin === 'unhandledRejection') return
			this.logger.error(error)
		})

		process.on('unhandledRejection', (error: Error) => {
			this.logger.error(error)
		})
	}

	async start() {
		this.logger.info('Error handler is working...')
	}
}

export const errorHandler = new ErrorHandler()
