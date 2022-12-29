import type { Context } from 'koa'
import { Get, Router } from '@discordx/koa'
import { container } from 'tsyringe'

import { Main } from '../main'


const Sayuna = container.resolve<Main>('Sayuna')

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
				Easily extensable and customizable all-in-one Discord bot. Moderation, music & fun!
				</p>
			</div>
		`
	}

	@Get('/guilds')
	guilds(context: Context): void {
		context.body = `${Sayuna.client.guilds.cache.map((g) => `${g.id}: ${g.name}\n`)}`
	}
}
