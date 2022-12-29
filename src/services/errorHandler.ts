import { singleton } from 'tsyringe'

import { CustomLogger } from './logger.js'


@singleton()
export class ErrorHandler {

    constructor(
        private logger: CustomLogger
    ) {

        process.on('uncaughtException', (error: Error, origin: string) => {
            if (origin === 'unhandledRejection') return
            this.logger.error(error, 'Exception')
        })

        process.on('unhandledRejection', (error: Error | any, promise: Promise<any>) => {
            this.logger.error(error, 'unhandledRejection')
        })
    }
}