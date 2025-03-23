import { Category } from '@discordx/utilities'
import {
	type CommandInteraction,
	EmbedBuilder,
	PermissionsBitField,
	Status
} from 'discord.js'
import { type Client, Discord, Guard, Slash, SlashGroup } from 'discordx'

import { globalConfig } from '../../config.js'
import { BotOwner } from '../../guards/bot-owner.guard.js'
import { DiscordUtils } from '../../utils/discord.utils.js'

const { constants } = globalConfig

@Discord()
@Category('dev')
@SlashGroup({
	name: 'dev',
	description: 'Developer only commands'
})
@SlashGroup('dev')
@Guard(BotOwner)
export class Dev {
	@Slash({
		name: 'health',
		description: 'Checks bot health',
		defaultMemberPermissions: PermissionsBitField.Flags.Administrator,
		dmPermission: false
	})
	public async health(
		interaction: CommandInteraction,
		client: Client
	): Promise<void> {
		try {
			const msg = await interaction.reply({
				content: 'Checking health...',
				fetchReply: true
			})

			const messageTime = `${msg.createdTimestamp - interaction.createdTimestamp}ms`
			const heartBeat = `${Math.round(client.ws.ping)}ms`
			const websocketStatus = Status[client.ws.status]

			const me = interaction.guild?.members.me ?? interaction.user

			const embed = new EmbedBuilder()
				.setTitle('**Health**')
				.setAuthor({
					name: client.user?.username,
					iconURL: me.displayAvatarURL()
				})
				.setDescription('Health status of the bot')
				.setTimestamp()
				.setFooter({ text: 'Sayuna bot' })

			embed.addFields([
				{
					name: 'Bot',
					value: `v${constants.version}`
				},
				{
					name: 'Node.js',
					value: `${process.version}`
				},
				{
					name: 'Discord.js',
					value: `v${constants.discordjs}`
				},
				{
					name: 'Distube',
					value: `v${constants.distube}`
				},
				{
					name: 'Message round-trip',
					value: messageTime
				},
				{
					name: 'Heartbeat ping',
					value: heartBeat
				},
				{
					name: 'Websocket status',
					value: websocketStatus
				}
			])

			await msg.edit({
				embeds: [embed],
				content: ''
			})
		} catch (err) {
			DiscordUtils.handleInteractionError(interaction, err)
		}
	}
}
