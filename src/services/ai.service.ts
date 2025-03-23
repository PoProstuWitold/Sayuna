import { ChatGPTAPI, ChatGPTError, type ChatMessage } from 'chatgpt'

import { globalConfig } from '../config.js'
import { BaseError } from '../exceptions/base.exception.js'
import type { MainOptions } from '../utils/types.js'
import { type CustomLogger, logger } from './logger.service.js'

export class AiService {
	public chatgptApi: ChatGPTAPI | undefined
	public initRes?: ChatMessage
	private error?: ChatGPTError
	private logger: CustomLogger = logger

	public constructor(public opts: MainOptions['aiOptions']) {
		this.initChatGPT()
	}

	private async initChatGPT() {
		try {
			if (this.opts.enabled && this.opts.chatpgtOptions) {
				this.chatgptApi = new ChatGPTAPI(this.opts.chatpgtOptions)
			}
		} catch (err) {
			this.logger.warn(err)
		}
	}

	async start() {
		try {
			if (this.opts.enabled) {
				if (!this.opts.chatpgtOptions?.apiKey) {
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
		} catch (err) {
			if (err instanceof ChatGPTError) {
				this.error = err
			}
			this.logger.warn(err)
		}
	}

	async chat(prompt: string) {
		if (!this.initRes) {
			throw new BaseError({
				name: 'OpenAI Error',
				message:
					this.error?.statusText ||
					`Couldn't get response from ChatGPT`,
				status: this.error?.statusCode || 400
			})
		}
		const res = await this.chatgptApi?.sendMessage(prompt, {
			timeoutMs: 10 * 60 * 1000,
			conversationId: this.initRes.conversationId,
			parentMessageId: this.initRes.id
		})

		this.initRes = res

		if (!res) {
			throw new BaseError({
				name: 'ChatGPT Error',
				message: `Couldn't get response from ChatGPT`
			})
		}

		return res
	}
}

export const aiService = new AiService(globalConfig.aiOptions)
