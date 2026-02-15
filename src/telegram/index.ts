import * as methods from './methods';
import type * as specs from './specs';

/**
 * Client for interacting with the Telegram Bot API.
 * Encapsulates the authentication token and provides a typed interface for methods.
 */
export class TelegramBot {
    /**
     * @param {string} token - The bot API token obtained from @BotFather.
     */
    constructor(private readonly token: string) {
        if (!this.token) {
            throw new Error('TelegramBot: Token is required');
        }
    }

    /**
     * Sends a text message.
     *
     * @param {specs.SendMessageRequest} payload - Object containing chat_id, text, and optional parameters.
     * @returns {Promise<specs.SendMessageResponse>}
     */
    public async sendMessage(
        payload: specs.SendMessageRequest,
    ): Promise<specs.SendMessageResponse> {
        return methods.sendMessage(this.token, payload);
    }

    /**
     * Sends a single document.
     *
     * @param {specs.SendDocumentRequest} payload - Object containing chat_id, document (Blob or string), and optional parameters.
     * @returns {Promise<specs.SendDocumentResponse>}
     */
    public async sendDocument(
        payload: specs.SendDocumentRequest,
    ): Promise<specs.SendDocumentResponse> {
        return methods.sendDocument(this.token, payload);
    }
}

export * from './specs';
