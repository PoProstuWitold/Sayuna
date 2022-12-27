import { config } from 'dotenv'
config()
import { dirname, importx } from '@discordx/importer'
import { Koa } from '@discordx/koa'
import { IntentsBitField } from 'discord.js'
import { Client, ILogger } from 'discordx'
import logger from './utils/logger.js'

export const client = new Client({
	botId: 'Sayuna',
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildVoiceStates,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.DirectMessages,
		IntentsBitField.Flags.GuildBans
	],
	silent: false,
	simpleCommand: {
		prefix: '!'
	},
	logger: new class djxLogger implements ILogger {
		public error(...args: unknown[]): void {
			logger.error(args)
		}

		public info(...args: unknown[]): void {
			logger.info(args)
		}

		public log(...args: unknown[]): void {
			logger.info(args)
		}

		public warn(...args: unknown[]): void {
			logger.warn(args)
		}
	}
})


async function start() {
	// The following syntax should be used in the commonjs environment
	// await importx(__dirname + "/{events,commands,api}/**/*.{ts,js}")

	// The following syntax should be used in the ECMAScript environment
	await importx(
		`${dirname(import.meta.url)}/{events,commands,api}/**/*.{ts,js}`
	)
	
	if (!process.env.BOT_TOKEN) {
		throw Error("Could not find BOT_TOKEN in your environment")
	}

	await client.login(process.env.BOT_TOKEN)

	const server = new Koa()

	await server.build()

	const port = process.env.PORT ?? 3000

	server.listen(port, () => {
		logger.info(`Discord API server started on port ${port}`)
		logger.info(`Visit http://localhost:${port}/guilds`)
	})
}

start()
