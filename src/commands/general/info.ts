import { CommandInteraction, EmbedBuilder } from 'discord.js'
import { Client, Discord, MetadataStorage, Slash, SlashGroup } from 'discordx'
import { Pagination } from '@discordx/pagination'
import { Category } from '@discordx/utilities'

import { DiscordUtils } from '../../utils/utils.js'


@Discord()
@Category('info')
@SlashGroup({ 
    name: 'info', 
    description: 'Commands for getting infos about different topics'
})
@SlashGroup('info')
export class Dev {

    @Slash({
        name: 'commands',
        description: 'Pagination for all slash command'
    })
    public async commands(interaction: CommandInteraction, client: Client): Promise<void> {
        try {
            const commands = MetadataStorage.instance.applicationCommandSlashesFlat.map((cmd) => {
                return { 
                    name: cmd.name,
                    description: cmd.description,  
                    //@ts-ignore
                    category: cmd.category
                }
            })
            
            const me = interaction?.guild?.members?.me ?? interaction.user
    
            const pages = commands.map((cmd, i) => {
                const embed = new EmbedBuilder()
                    .setTitle('**Slash command info**')
                    .setAuthor({
                        name: client.user!.username,
                        iconURL: me.displayAvatarURL()
                    })
                    .setTimestamp()
                    .setFooter({ text: `Page ${i + 1} of ${commands.length}` })
                    .addFields({ 
                        name: 'Category', 
                        value: `${
                            cmd.category.length > 0
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
          
                return { embeds: [embed] }
            })
          
            const pagination = new Pagination(interaction, pages)
            await pagination.send()
        } catch (err) {
            DiscordUtils.handleInteractionError(interaction, err)
        }
    }
}