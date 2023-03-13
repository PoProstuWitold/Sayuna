import { singleton } from 'tsyringe'

import { CustomLogger } from './logger.service.js'


@singleton()
export class ErrorHandler {

    constructor(
        private logger: CustomLogger
    ) {

        process.on('uncaughtException', (error: Error, origin: string) => {
            if (origin === 'unhandledRejection') return
            this.logger.error(error)
        })

        process.on('unhandledRejection', (error: Error | any) => {
            this.logger.error(error)
        })
    }

    async start() {
        this.logger.info('Error handler is working...')
    }
}