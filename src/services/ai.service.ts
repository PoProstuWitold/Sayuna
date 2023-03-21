//@ts-nocheck
import { inject, singleton } from 'tsyringe'
import { ChatGPTAPI } from 'chatgpt'

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

    async chat(prompt: string) {
        try {
            let res = await this.chatgptApi?.sendMessage(prompt, {
                onProgress: async (partialResponse) => {
                    // It is possible to make real time updates like ChatGPT does, but it's too resource heavy
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