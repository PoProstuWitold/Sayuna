import { Get, Router } from '@discordx/koa'
import type { Context } from 'koa'

import { client } from '../main.js'

@Router({
	name: 'Main routes',
	description: 'Main routes for Discord bot'
})
export class API {
	@Get('/')
	index(context: Context): void {
		context.body = `
			<div style="text-align: center">
				<h1>
				Sayuna
				</h1>
				<p>
				Easily extensable and customizable Discord all-in-one bot - moderation, music & fun!
				</p>
			</div>
		`
	}

	@Get('/guilds')
	guilds(context: Context): void {
		context.body = `${client.client.guilds.cache.map((g) => `${g.id}: ${g.name}\n`)}`
	}
}
