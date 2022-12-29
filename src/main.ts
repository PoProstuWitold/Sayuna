import 'reflect-metadata'
import 'dotenv/config'

import { Client, DIService, tsyringeDependencyRegistryEngine } from 'discordx'
import { dirname, importx } from '@discordx/importer'
import { Koa } from '@discordx/koa'
import { container } from 'tsyringe'

import { clientOptions } from './config.js'
import { CustomLogger } from './services/logger.js'
import { ErrorHandler } from './services/errorHandler.js'


export const client = new Client(clientOptions)

const logger = container.resolve(CustomLogger)

async function bot(client: Client) {
	try {
		DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container)
		await importx(
			`${dirname(import.meta.url)}/{events,commands,api}/**/*.{ts,js}`
		)
		
		if (!process.env.BOT_TOKEN) {
			logger.error('No BOT_TOKEN specified!')
			throw Error('No BOT_TOKEN specified!')
		}
		
		if (process.env.NODE_ENV === 'development') {
			if(!process.env.DEV_GUILD_ID) {
				logger.error('No DEV_GUILD_ID specified!')
				throw Error('No DEV_GUILD_ID specified!')
			}
		}

		await client.login(process.env.BOT_TOKEN)
	} catch (err) {
		throw err
	}
}

async function api() {
	const server = new Koa()

	await server.build()

	const port = process.env.PORT ?? 3000

	server.listen(port, () => {
		logger.info(`Discord API server started on port ${port}`)
		logger.info(`Visit http://localhost:${port}/guilds`)
	})
}

async function start() {
	container.resolve(ErrorHandler)

	await bot(client)
	await api()
}

start()