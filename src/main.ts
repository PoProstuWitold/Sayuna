import 'reflect-metadata'

import { dirname, importx } from '@discordx/importer'
import type { Client } from 'discordx'

import { globalConfig } from './config.js'
import {
	type ErrorHandler,
	errorHandler
} from './services/error-handler.service.js'
import { type CustomLogger, logger } from './services/logger.service.js'
import type { MainOptions } from './utils/types.js'

export class Main {
	public client: Client

	constructor(
		public opts: MainOptions,
		private logger: CustomLogger,
		private errorHandler: ErrorHandler
	) {
		this.opts = opts
		this.client = globalConfig.client
		this.logger.info('Starting app...')
	}

	public async bot(token: string) {
		try {
			await importx(
				`${dirname(import.meta.url)}/{events,commands,api}/**/*.{ts,js}`
			)

			await this.client.login(token)
			this.logger.info('Bot has logged in...')
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	public async start() {
		await this.errorHandler.start()

		const { token } = await this.checkEnvs()

		await this.bot(token)
	}

	private async checkEnvs() {
		if (!this.opts.config.token) {
			throw Error('No BOT_TOKEN specified!')
		}

		if (!this.opts.clientOptions.simpleCommand?.prefix) {
			this.logger.warn(
				'No BOT_PREFIX specified! If you want to use legacy message commands you must provide it'
			)
		}

		if (!this.opts.clientOptions.botId) {
			this.logger.warn('No BOT_ID specified!')
		}

		// NODE ENV = 'development' or 'production'
		if (process.env.NODE_ENV === 'development') {
			if (!this.opts.config.devGuildId) {
				throw Error('No DEV_GUILD_ID specified!')
			}
			if (!this.opts.config.ownerId) {
				throw Error('No OWNER_ID specified!')
			}
		}

		if (process.env.NODE_ENV === 'production') {
			if (!this.opts.config.ownerId) {
				this.logger.warn(
					'No OWNER_ID specified! If you want be able to use "owner" commands you must provide it'
				)
			}
		}

		this.logger.info('Enviroment variables are checked...')

		return {
			nodeEnv: process.env.NODE_ENV,
			token: this.opts.config.token,
			devGuildId: this.opts.config.devGuildId,
			ownerId: this.opts.config.ownerId
		}
	}
}

export const sayuna = new Main(globalConfig, logger, errorHandler)

sayuna.start()
