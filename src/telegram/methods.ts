import * as core from '@actions/core';
import type {
    SendDocumentResponse,
    SendDocumentRequest,
    SendMessageResponse,
    SendMessageRequest,
} from './specs';

/**
 * Internal helper to send requests to the Telegram Bot API.
 * Handles FormData construction, file uploads (Blobs), and JSON serialization of objects.
 * Logs the outgoing payload as a JSON-like object for debugging.
 *
 * @template T - The expected shape of the Telegram API response.
 * @param {string} token - Telegram Bot API token.
 * @param {string} method - API method name (e.g., 'sendMessage').
 * @param {Record<string, any>} payload - Object containing request parameters.
 * @returns {Promise<T>} A promise resolving to the API response.
 */
async function sendRequest<T = Record<string, any>>(
    token: string,
    method: string,
    payload: Record<string, any>,
): Promise<T> {
    const url = `https://api.telegram.org/bot${token}/${method}`;
    const formData = new FormData();
    const debugPayload: Record<string, any> = {};

    for (const [key, value] of Object.entries(payload)) {
        if (value === undefined || value === null) continue;

        if (value instanceof Blob) {
            const fileName = (value as any).name || 'file';
            formData.append(key, value, fileName);
            debugPayload[key] = `[Blob: ${fileName}, Size: ${value.size} bytes]`;
            continue;
        }

        if (typeof value === 'object') {
            const serialized = JSON.stringify(value);
            formData.append(key, serialized);
            debugPayload[key] = value;
            continue;
        }

        const stringValue = String(value);
        formData.append(key, stringValue);
        debugPayload[key] = value;
    }

    // Logging
    core.info(`--- Outgoing Telegram Request: ${method} ---`);
    core.info(JSON.stringify({ ...debugPayload, chat_id: '***' }, null, 2));

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        const result = (await response.json()) as any;

        if (!response.ok) {
            core.error(
                `❌ Telegram API Error [${method}]: ${result.description} (Code: ${result.error_code})`,
            );
        } else {
            core.info(`✅ Telegram API Success [${method}]`);
        }

        return result as T;
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        core.error(`❌ Network Error [${method}]: ${msg}`);
        throw error;
    }
}

/**
 * Send text messages.
 *
 * @see https://core.telegram.org/bots/api#sendmessage
 *
 * @param {string} token - Telegram Bot API token.
 * @param {SendMessageRequest} payload - Message parameters including chat_id and text.
 * @returns {Promise<SendMessageResponse>}
 */
export async function sendMessage(
    token: string,
    payload: SendMessageRequest,
): Promise<SendMessageResponse> {
    // Validate payload
    if (!payload?.chat_id) throw new Error('Telegram: chat_id is required');
    // Prepare & check message
    payload.text = payload?.text?.trim() || '';
    if (payload.text.length <= 0) {
        throw new Error('Telegram: text is required');
    }

    return await sendRequest<SendMessageResponse>(token, 'sendMessage', payload);
}

/**
 * Send single documents.
 *
 * @see https://core.telegram.org/bots/api#senddocument
 *
 * @param {string} token - Telegram Bot API token.
 * @param {SendDocumentRequest} payload - Document parameters including chat_id and the file itself.
 * @returns {Promise<SendDocumentResponse>}
 */
export async function sendDocument(
    token: string,
    payload: SendDocumentRequest,
): Promise<SendDocumentResponse> {
    // Validate payload
    if (!payload.chat_id) throw new Error('Telegram: chat_id is required');
    if (!payload.document) throw new Error('Telegram: document is required');
    // Prepare caption
    payload.caption = payload?.caption?.trim() || undefined;
    payload.parse_mode = payload?.parse_mode || 'HTML';

    return await sendRequest<SendDocumentResponse>(token, 'sendDocument', payload);
}
