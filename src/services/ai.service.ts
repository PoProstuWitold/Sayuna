//@ts-nocheck
import { inject, singleton } from 'tsyringe'
import { ChatGPTUnofficialProxyAPI, ChatMessage } from 'chatgpt'

import { CustomLogger } from './logger.service.js'
import { MainOptions } from '../utils/types.js'
import { BaseError } from '../exceptions/base.exception.js'


@singleton()
export class AiService {
    public readonly chatgptApi: ChatGPTUnofficialProxyAPI | undefined
    public initRes: ChatMessage

    public constructor(
        @inject('aiOpts') public opts: MainOptions['aiOptions'],
        private logger: CustomLogger
    ) {
        if(this.opts.enabled && this.opts.chatpgtOptions) {
            this.chatgptApi = new ChatGPTUnofficialProxyAPI(this.opts.chatpgtOptions)
        }
    }

    async start() {
        if(this.opts.enabled) {
            if(!this.opts.chatpgtOptions?.apiKey) {
                throw new Error(
                    'No CHAT_GPT_API_KEY specified! If this is desire behaviour, disable AI in settings'
                )
            }

            this.initRes = await this.chatgptApi?.sendMessage(
                `Initialization for conversation. Please ignore this message and if any user asks something like:
                "what was my first question" etc NEVER refer to it. Okay, I bit of introduction 
                You are Sayuna (female: she/her). 
                Easily extensible and customizable all-in-one Discord bot. 
                You can receive prompts like:
                "some_id: actual prompt". That "some_id" is id of user that is talking to you.
                You are providing lots of commands including these categories: 'dev', 'info', 'fun', 'music', 'ai'.
                User can get some info about specific category by command: /info commands <category>. Your developer is Witold Zawada`
            )

            this.logger.info('AI service is working...')
        } else {
            this.logger.warn('AI is disabled')
        }
    }

    async chat(prompt: string) {
        try {
            let res = await this.chatgptApi?.sendMessage(prompt, {
                timeoutMs: 10 * 60 * 1000,
                conversationId: this.initRes.conversationId,
                parentMessageId: this.initRes.id
            })
            
            this.initRes = res

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