import { 
    CommandInteraction, GuildMember, InteractionReplyOptions, 
    MessageComponentInteraction, VoiceBasedChannel 
} from 'discord.js'

export class DiscordUtils {
    public static async replyOrFollowUp(
        interaction: CommandInteraction | MessageComponentInteraction, 
        replyOptions: (InteractionReplyOptions & { ephemeral?: boolean }) | string
    ): Promise<void> {
        // if interaction is already replied
        if (interaction.replied) {
            await interaction.followUp(replyOptions)
            return
        }

        // if interaction is deferred but not replied
        if (interaction.deferred) {
            await interaction.editReply(replyOptions)
            return
        }

        // if interaction is not handled yet
        await interaction.reply(replyOptions)
    }


    public static async joinIfVoiceChannel(interaction: CommandInteraction): Promise<VoiceBasedChannel | undefined> {
        if (
            !interaction.guild ||
            !interaction.channel ||
            !(interaction.member instanceof GuildMember)
        ) {
            interaction.reply(
              '> Your request could not be processed, please try again later'
            )
      
            setTimeout(() => interaction.deleteReply(), 15e3)

            return
        }
      
        if (
            !(interaction.member instanceof GuildMember) ||
            !interaction.member.voice.channel
        ) {
            interaction.reply('> You are not in the voice channel')
      
            setTimeout(() => interaction.deleteReply(), 15e3)
            return
        }
      
        await interaction.deferReply()
        
        return interaction.member.voice.channel
    }
}