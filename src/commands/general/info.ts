import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from 'discord.js'
import { 
    Client, DApplicationCommand, Discord, MetadataStorage, Slash, SlashChoice, SlashGroup, SlashOption
} from 'discordx'
import { Pagination, PaginationOptions, PaginationType } from '@discordx/pagination'
import { Category, ICategory } from '@discordx/utilities'

import { DiscordUtils } from '../../utils/discord.utils.js'
import { CommandDocs } from '../../utils/types.js'


const choices = ['dev', 'info', 'fun', 'music', 'ai', 'mod']

@Discord()
@Category('info')
@SlashGroup({ 
    name: 'info', 
    description: 'Commands for getting infos about different topics'
})
@SlashGroup('info')
export class Info {

    @Slash({
        name: 'commands',
        description: 'Pagination for all slash command'
    })
    public async commands(
        @SlashChoice(...choices)
        @SlashOption({
            description: 'Get docs only for specific command group',
            name: 'group',
            required: false,
            type: ApplicationCommandOptionType.String,
        })
        group: string,
        interaction: CommandInteraction, client: Client
    ): Promise<void> {
        try {
            const allCommands: CommandDocs[] = MetadataStorage.instance.applicationCommandSlashesFlat.map(
                    (cmd: DApplicationCommand & ICategory) => {
                    return { 
                        name: cmd.name,
                        description: cmd.description,
                        category: cmd.category
                    } 
            })

            let commands: CommandDocs[]
            let groupCommands: CommandDocs[]


            if(!group) {
                commands = allCommands
            } else {
                groupCommands = allCommands.filter((cmd) => cmd.category === group)
                commands = groupCommands
            }
            
            const me = interaction?.guild?.members?.me ?? interaction.user
            let externalEmbed: EmbedBuilder
            const pages = commands.map((cmd, i) => {
                const embed = new EmbedBuilder()
                    .setTitle(`${groupCommands && groupCommands.length > 0 ? `${group} commands info` : '**All commands info**'}`)
                    .setAuthor({
                        name: client.user!.username,
                        iconURL: me.displayAvatarURL()
                    })
                    .setTimestamp()
                    .setFooter({ text: `Page ${i + 1} of ${commands.length}` })
                    .addFields({ 
                        name: 'Category', 
                        value: `${
                            cmd.category && cmd.category.length > 0
                                ? cmd.category
                                : 'Category unavailable'
                            }`
                    })
                    .addFields({ 
                        name: 'Name', 
                        value: cmd.name 
                    })
                    .addFields({
                        name: 'Description',
                        value: `${
                            cmd.description.length > 0
                                ? cmd.description
                                : 'Description unavailable'
                            }`
                    })
                externalEmbed = embed;
                return { embeds: [embed] }
            })
          
            if(pages.length == 1) {
                const {
                    embeds
                } = pages[0]

                await DiscordUtils.replyOrFollowUp(interaction, {
                    embeds
                })
            } else {
                const pagination = new Pagination(interaction, pages)
                await pagination.send()
            }
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }
}