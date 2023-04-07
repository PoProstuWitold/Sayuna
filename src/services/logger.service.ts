import { Logger, createLogger, format, transports } from 'winston'
import moment from 'moment'
import { singleton } from 'tsyringe'


@singleton()
export class CustomLogger {
    private readonly logger: Logger

    public constructor() {
        this.logger = createLogger({
            level: 'debug',
            transports: [
                new transports.Console({
                    level: 'debug',
                    format: this.getFormat()
                })
            ]
        })
    }

    log(...args: any) {
        return this.logger.log({
            level: this.logger.level,
            message: args
        })
    }

    info(...args: any) {
        return this.logger.info({
            level: this.logger.level,
            message: args
        })
    }

    error(...args: any) {
        return this.logger.error({
            level: this.logger.level,
            message: args
        })
    }

    warn(...args: any) {
        return this.logger.warn({
            level: this.logger.level,
            message: args
        })
    }

    private getFormat() {
        const { combine, splat, timestamp, printf, colorize } = format

        const myFormat = printf(({level: l, message: m, timestamp: t, ...metadata}) => {
            const time = moment().format('DD-MM-YYYY HH:mm:ss').trim()
            let msg = `[${l}] ${time}: ${m} `

            if (metadata && JSON.stringify(metadata) !== '{}') {
                msg += JSON.stringify(metadata)
            }

            if (m && typeof m === 'object' && m !== null && typeof m[0] !== 'string' && Object.keys(m[0]).length !== 0) {
                msg += JSON.stringify(m, null, 4)
            }

            return msg
        })

        return combine(colorize(), splat(), timestamp(), myFormat)
    }
}