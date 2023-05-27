import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, Guild, GuildMember, PermissionsBitField, TextChannel, User } from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { Category } from '@discordx/utilities'

import { DiscordUtils } from '../../utils/discord.utils.js'
import { BaseError } from '../../exceptions/base.exception.js'


@Discord()
@Category('mod')
@SlashGroup({ 
    name: 'mod', 
    description: 'Commands for managing server and users',
	defaultMemberPermissions: [
		PermissionsBitField.Flags.ManageChannels,
		PermissionsBitField.Flags.ManageGuild,
		PermissionsBitField.Flags.ManageEvents,
		PermissionsBitField.Flags.ManageMessages,
		PermissionsBitField.Flags.ManageNicknames,
		PermissionsBitField.Flags.ManageRoles,
		PermissionsBitField.Flags.ManageThreads
	]
})
@SlashGroup('mod')
export class Moderation {
    @Slash({
        name: 'clear',
        description: 'Clear messages from text channel'
    })
    public async clearMessages(
		@SlashOption({
			description: 'Number of message to clear',
			name: 'number',
			type: ApplicationCommandOptionType.Integer,
			maxValue: 100,
		})
		number: number,
        interaction: CommandInteraction
    ): Promise<void> {
        try {
            if(!interaction) throw Error('No interaction found')
			if(!interaction.channel || !(interaction.channel instanceof TextChannel)) 
				throw new BaseError({
					name: 'Invalid Channel',
					message: 'Channel must be of type text'
				})
			const actualNumber = number ? number : 20

			await interaction.channel.bulkDelete(actualNumber, true)

			const msg = await DiscordUtils.replyOrFollowUp(
				interaction, 
				`> User <@${interaction.user.id}> cleared **${actualNumber}** messages from channel **${interaction.channel.name}**`
			)
			
			setTimeout(() => {
				msg.deleteReply()
			}, 3000)
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }

	@Slash({
		name: 'kick',
		description: 'Kick a user',
	})
	public async kickUser(
		@SlashOption({
			description: 'User you want to kick',
			name: 'user',
			required: true,
			type: ApplicationCommandOptionType.User,
		})
		user: string,
		@SlashOption({
			description: 'Reason for kick',
			name: 'reason',
			type: ApplicationCommandOptionType.String
		})
		reason: string,
		interaction: CommandInteraction
	): Promise<void> {
		try {
			if (!interaction) throw Error('No interaction found')

			const guild = interaction.guild
			if (!guild) {
				throw new BaseError({
					name: 'Invalid Guild',
					message: `Command must be used in a guild`,
				})
			}

			const actualReason = reason ? reason : 'No reason'
			const member = await guild.members.kick(user, actualReason)

			if (!member) {
				throw new BaseError({
					name: 'Invalid User',
					message: `The provided user doesn't exist`,
				})
			}

			const embed = new EmbedBuilder()
				.setTitle(`**User Kicked**`)
				.setDescription(`Kicked <@${member instanceof GuildMember ? member.user.id : ''}>`)
				.setFields({
					name: 'Reason',
					value: actualReason
				})
				.setTimestamp()

			await DiscordUtils.replyOrFollowUp(interaction, {
				embeds: [embed],
			})
		} catch (err) {
			DiscordUtils.handleInteractionError(interaction, err)
		}
	}

	@Slash({
		name: 'ban',
		description: 'Ban a user',
	})
	public async banUser(
		@SlashOption({
			description: 'User you want to ban',
			name: 'user',
			required: true,
			type: ApplicationCommandOptionType.User,
		})
		user: string,
		@SlashOption({
			description: 'Reason for ban',
			name: 'reason',
			type: ApplicationCommandOptionType.String
		})
		reason: string,
		interaction: CommandInteraction
	): Promise<void> {
		try {
			if (!interaction) throw Error('No interaction found')

			const guild = interaction.guild
			if (!guild) {
				throw new BaseError({
					name: 'Guild not found',
					message: `The command must be used in a guild`,
				})
			}

			const actualReason = reason ? reason : 'No reason'
			const member = await guild.members.ban(user, {
				reason: actualReason
			})

			if (!member) {
				throw new BaseError({
					name: 'Invalid User',
					message: `The provided user doesn't exist`,
				})
			}

			const embed = new EmbedBuilder()
				.setTitle(`**User Banned**`)
				.setDescription(`Banned <@${member instanceof GuildMember ? member.user.id : ''}>`)
				.setFields({
					name: 'Reason',
					value: actualReason
				})
				.setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
				.setTimestamp()

			await DiscordUtils.replyOrFollowUp(interaction, {
				embeds: [embed],
			})
		} catch (err) {
			DiscordUtils.handleInteractionError(interaction, err)
		}
	}

	@Slash({
		name: 'unban',
		description: 'Unban a user',
	})
	public async unbanUser(
		@SlashOption({
			description: 'Id of user you want to unban',
			name: 'id',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		user: string,
		interaction: CommandInteraction
	): Promise<void> {
		try {
			if (!interaction) throw Error('No interaction found')

			const guild = interaction.guild
			if (!guild) {
				throw new BaseError({
					name: 'Guild not found',
					message: `The command must be used in a guild`,
				})
			}

			const member = await guild.members.unban(user)
			
			if (!member) {
				throw new BaseError({
					name: 'Invalid User',
					message: `The provided user doesn't exist`,
				})
			}

			const embed = new EmbedBuilder()
				.setTitle(`**User Unbanned**`)
				.setDescription(`Unbanned <@${member instanceof GuildMember ? member.user.id : member.id}>`)
				.setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
				.setTimestamp()

			await DiscordUtils.replyOrFollowUp(interaction, {
				embeds: [embed],
			})
		} catch (err) {
			DiscordUtils.handleInteractionError(interaction, err)
		}
	}
}