import { CommandInteraction, EmbedBuilder, PermissionsBitField, Status } from 'discord.js'
import { Client, Discord, Guard, Slash, SlashGroup } from 'discordx'
import { Category } from '@discordx/utilities'

import { BotOwner } from '../../guards/bot-owner.guard.js'
import { DiscordUtils } from '../../utils/discord.utils.js'
import { CONSTANTS } from '../../config.js'


@Discord()
@Category('dev')
@SlashGroup({ 
    name: 'dev', 
    description: 'Developer only commands'
})
@SlashGroup('dev')
@Guard(
    BotOwner
)
export class Dev {

    @Slash({
        name: 'health',
        description: 'Checks bot health',
        defaultMemberPermissions: PermissionsBitField.Flags.Administrator,
        dmPermission: false
    })
    public async health(interaction: CommandInteraction, client: Client): Promise<void> {
        try {
            const msg = await interaction.reply({ content: 'Checking health...', fetchReply: true })

            const messageTime = `${msg.createdTimestamp - interaction.createdTimestamp}ms`
            const heartBeat = `${Math.round(client.ws.ping)}ms`
            const websocketStatus = Status[client.ws.status]

            const me = interaction?.guild?.members?.me ?? interaction.user

            const embed = new EmbedBuilder()
                .setTitle(`**Health**`)
                .setAuthor({
                    name: client.user!.username,
                    iconURL: me.displayAvatarURL()
                })
                .setDescription(`Health status of the bot`)
                .setTimestamp()
                .setFooter({ text: 'Sayuna bot' })

            embed.addFields([
				{
                    name: 'Bot version',
                    value: `${CONSTANTS['version']}`
                },
				{
                    name: 'Node.js version',
                    value: `${process.version}`
                },
				{
                    name: 'Discord.js version',
                    value: `${CONSTANTS['discordjs']}`
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