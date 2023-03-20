import { inject, singleton } from 'tsyringe'
import { ChatGPTAPI } from 'chatgpt'
import { CommandInteraction, EmbedBuilder, Message } from 'discord.js'

import { CustomLogger } from './logger.service.js'
import { MainOptions } from '../utils/types.js'
import { BaseError } from '../exceptions/base.exception.js'

@singleton()
export class AiService {
    public readonly chatgptApi: ChatGPTAPI | undefined

    public constructor(
        @inject('aiOpts') public opts: MainOptions['aiOptions'],
        private logger: CustomLogger
    ) {
        if(this.opts.enabled && this.opts.chatpgtOptions) {
            this.chatgptApi = new ChatGPTAPI(this.opts.chatpgtOptions)
        }
    }

    async start() {
        if(this.opts.enabled) {
            if(!this.opts.chatpgtOptions?.apiKey) {
                throw new Error(
                    'No CHAP_GPT_API_KEY specified! If this is desire behaviour, disable AI in settings'
                )
            }
            this.logger.info('AI service is working...')
        } else {
            this.logger.warn('AI is disabled')
        }
    }

    async chat(prompt: string, interaction: CommandInteraction) {
        try {
            let res = await this.chatgptApi?.sendMessage(prompt, {
                onProgress: async (partialResponse) => {
                    const me = interaction.user

                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: me.username,
                            iconURL: `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=256`
                        })
                        .setTitle(`Sayuna`)
                        .addFields({
                            name: 'Prompt',
                            value: `> ${prompt}`
                        })
                        .addFields({
                            name: 'Answer',
                            value: partialResponse.text
                        })
                        .setFooter({
                            text: `ChatGPT API`
                        })
                        .setTimestamp()

                    await interaction.editReply({
                        embeds: [
                            embed
                        ]
                    })
                },
                timeoutMs: 10 * 60 * 1000
            })
            

            if(!res) {
                throw new BaseError({
                    name: 'ChatGPT Error',
                    message: `Couldn't get response from ChatGPT`
                })
            } 

            return res
        } catch (err) {
            throw err
        }
    }

}