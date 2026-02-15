import * as core from '@actions/core';
import { TelegramBot } from './telegram';
import { ActionConfig } from './action';
import { fileToBlob } from './utils';

/**
 * Orchestrates the execution logic of the GitHub Action.
 * Determines the appropriate Telegram method to call based on the provided configuration.
 *
 * @param {ActionConfig} config - Validated and typed action configuration object.
 * @returns {Promise<void>}
 */
export async function run(config: ActionConfig): Promise<void> {
    const bot = new TelegramBot(config.botToken);

    const common = {
        chat_id: config.chatId,
        parse_mode: config.parseMode,
        message_thread_id: config.messageThreadId,
        message_effect_id: config.messageEffectId,
        protect_content: config.protectContent,
        disable_notification: config.disableNotification,
        reply_parameters: config.replyParameters,
    };

    try {
        const method = config.getActionMethod();
        let response;

        switch (method) {
            case 'sendMessage':
                core.info('Sending text message...');
                if (!config.messageText || config.messageText.trim().length === 0) {
                    throw new Error(
                        'Action execution failed: "message_text" is required for sendMessage but was found empty.',
                    );
                }

                response = await bot.sendMessage({
                    ...common,
                    text: config.messageText,
                    reply_markup: config.replyMarkup,
                });
                break;

            case 'sendDocument':
                core.info(`Preparing to send document: ${config.document}`);
                if (!config.document) {
                    throw new Error(
                        'Action execution failed: "document" path is missing for sendDocument.',
                    );
                }

                response = await bot.sendDocument({
                    ...common,
                    document: fileToBlob(config.document),
                    caption: config.documentCaption || config.messageText,
                    reply_markup: config.replyMarkup,
                });
                break;
            default:
                throw new Error('Unsupported method/action: "' + method + '"');
        }

        if (response.ok) {
            const result = Array.isArray(response.result) ? response.result[0] : response.result;

            core.info('✅ Success! Message sent.');
            core.setOutput('message_id', result.message_id);
            core.setOutput('ok', true);
        } else {
            core.setFailed(
                `❌ Telegram API Error: ${response.description} (Code: ${response.error_code})`,
            );
        }
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(`Internal Action Error: ${error.message}`);
        } else {
            core.setFailed('An unknown error occurred during execution.');
        }
    }
}
