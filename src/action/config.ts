import * as core from '@actions/core';
import type { InlineKeyboardMarkup, ReplyParameters, ParseMode } from '../telegram';

/**
 * Raw input data received from GitHub Action context.
 * Keys match the snake_case naming convention defined in action.yml.
 */
interface RawActionInputs {
    /** Telegram Bot Token from @BotFather */
    bot_token: string;
    /** Unique identifier for the target chat or username of the target channel */
    chat_id: string;
    /** The text of the message to be sent */
    message_text?: string;
    /** Mode for parsing entities in the message text (HTML, Markdown, or MarkdownV2) */
    parse_mode?: ParseMode;
    /** Path to a local file or a URL to be sent as a document */
    document?: string;
    /** Caption for the document */
    document_caption?: string;
    /** Unique identifier for the target message thread (topic) */
    message_thread_id?: number | string;
    /** Unique identifier for the message effect to be added to the message */
    message_effect_id?: number | string;
    /** If true, the message content will be protected from forwarding and saving */
    protect_content?: boolean | string;
    /** If true, the message will be sent silently without user notification */
    disable_notification?: boolean | string;
    /** JSON string representing an InlineKeyboardMarkup object */
    reply_markup?: string;
    /** URL for a quick inline keyboard link button */
    reply_link_url?: string;
    /** Label text for a quick inline keyboard link button */
    reply_link_text?: string;
    /** JSON string representing ReplyParameters for replying to a specific message */
    reply_parameters?: string;
}

/**
 * Union type representing the available Telegram Bot API methods supported by this action.
 */
export type ActionMethod = 'sendMessage' | 'sendDocument';

/**
 * Validated and typed configuration for the Telegram Action.
 * Transforms raw snake_case inputs into a camelCase object used by the core logic.
 */
export class ActionConfig {
    public botToken: string = 'undefined';
    public chatId: string | number = 'undefined';
    public messageText?: string;
    public document?: string;
    public documentCaption?: string;
    public parseMode: ParseMode = 'HTML';
    public messageThreadId?: number;
    public messageEffectId?: string;
    public protectContent: boolean = false;
    public disableNotification: boolean = false;
    public replyMarkup?: InlineKeyboardMarkup | object;
    public replyParameters?: ReplyParameters;

    /**
     * Internal constructor for creating a configuration instance.
     *
     * @param {Partial<ActionConfig>} config - Partial configuration object used for initialization.
     */
    public constructor(config: Partial<ActionConfig>) {
        Object.assign(this, config);
    }

    /**
     * Determines the appropriate Telegram API method based on the provided configuration properties.
     * Priority: Text message > Single document.
     *
     * @returns {ActionMethod} The name of the method to be executed.
     * @throws {Error} If no valid content (text or document) is found in the configuration.
     */
    public getActionMethod(): ActionMethod {
        switch (true) {
            case typeof this.messageText === 'string' && this.messageText !== '':
                return 'sendMessage';
            case typeof this.document !== 'undefined' && this.document !== '':
                return 'sendDocument';
            default:
                throw new Error(
                    'No valid content found. You must provide at least "message_text" or "document".',
                );
        }
    }

    /**
     * Creates an ActionConfig instance by pulling data directly from GitHub Action inputs.
     * This is the primary method used during the action's production execution.
     *
     * @returns {ActionConfig} A fully initialized ActionConfig instance.
     * @throws {Error} If required inputs (bot_token, chat_id) are missing or invalid.
     */
    public static fromGithubInput(): ActionConfig {
        return ActionConfig.fromRawInputs({
            bot_token: core.getInput('bot_token', { required: true }),
            chat_id: core.getInput('chat_id', { required: true }),
            message_text: core.getInput('message_text') || undefined,
            document: core.getInput('document') || undefined,
            document_caption: core.getInput('document_caption') || undefined,
            parse_mode: (core.getInput('parse_mode') || 'HTML') as ParseMode,
            message_thread_id: core.getInput('message_thread_id')
                ? core.getInput('message_thread_id')
                : undefined,
            message_effect_id: core.getInput('message_effect_id') || undefined,
            protect_content: core.getBooleanInput('protect_content'),
            disable_notification: core.getBooleanInput('disable_notification'),
            reply_link_url: core.getInput('reply_link_url'),
            reply_link_text: core.getInput('reply_link_text'),
            reply_markup: core.getInput('reply_markup'),
            reply_parameters: core.getInput('reply_parameters'),
        });
    }

    /**
     * Normalizes raw snake_case inputs into a typed ActionConfig.
     * Useful for unit testing by passing custom input objects without mocking @actions/core.
     *
     * @param {RawActionInputs & {[key: string]: any}} inputs - An object containing raw input keys.
     * @returns {ActionConfig} A validated and transformed ActionConfig instance.
     * @throws {Error} If mandatory fields (bot_token, chat_id) are missing.
     */
    public static fromRawInputs(inputs: RawActionInputs & { [key: string]: any }): ActionConfig {
        if (!inputs?.bot_token || !inputs?.chat_id) {
            throw new Error('Bot token & Chat ID is required.');
        }

        const linkUrl = inputs?.reply_link_url;
        const linkText = inputs?.reply_link_text;
        const rawReplyMarkup = inputs?.reply_markup;
        let replyMarkup: ActionConfig['replyMarkup'];

        if (linkUrl && linkText) {
            replyMarkup = {
                inline_keyboard: [[{ text: linkText, url: linkUrl }]],
            };
        } else if (rawReplyMarkup) {
            try {
                replyMarkup = JSON.parse(rawReplyMarkup);
            } catch (error) {
                core.warning(`Failed to parse reply_markup JSON: ${error}`);
            }
        }

        let replyParameters: ReplyParameters | undefined;
        const rawReplyParams = inputs?.reply_parameters;
        if (rawReplyParams) {
            try {
                replyParameters = JSON.parse(rawReplyParams);
            } catch (error) {
                core.warning(`Failed to parse reply_parameters JSON: ${error}`);
            }
        }

        return new ActionConfig({
            botToken: inputs.bot_token,
            chatId: isNaN(Number(inputs.chat_id)) ? inputs.chat_id : Number(inputs.chat_id),
            messageText: inputs?.message_text || undefined,
            document: inputs?.document || undefined,
            documentCaption: inputs?.document_caption || undefined,
            parseMode: inputs?.parse_mode || 'HTML',
            messageThreadId: inputs?.message_thread_id
                ? Number(inputs.message_thread_id)
                : undefined,
            messageEffectId: ['number', 'string'].includes(typeof inputs?.message_effect_id)
                ? String(inputs.message_effect_id)
                : undefined,
            protectContent: ['true', true, 1].includes(inputs?.protect_content || false),
            disableNotification: ['true', true, 1].includes(inputs?.disable_notification || false),
            replyMarkup,
            replyParameters,
        });
    }
}
