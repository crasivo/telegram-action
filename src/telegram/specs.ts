/** --- General --- */

export type ParseMode = 'HTML' | 'Markdown' | 'MarkdownV2' | (string & {});

export interface ErrorResponse {
    ok: false;
    error_code: number;
    description: string;
    parameters?: {
        migrate_to_chat_id?: number;
        retry_after?: number;
    };
}

export interface SuccessResponse<R> {
    ok: true;
    result: R;
}

export interface LinkPreviewOptions {
    is_disabled?: boolean;
    url?: string;
    prefer_small_media?: boolean;
    prefer_large_media?: boolean;
    show_above_text?: boolean;
}

export interface ReplyParameters {
    message_id: number;
    chat_id?: number | string;
    allow_sending_without_reply?: boolean;
    quote?: string;
    quote_parse_mode?: ParseMode;
    quote_entities?: any[];
    quote_position?: number;
}

export interface InlineKeyboardButton {
    text: string;
    url?: string;
    callback_data?: string;
    web_app?: { url: string };
    login_url?: {
        url: string;
        forward_text?: string;
        bot_username?: string;
        request_write_access?: boolean;
    };
    switch_inline_query?: string;
    switch_inline_query_current_chat?: string;
    pay?: boolean;
}

export interface InlineKeyboardMarkup {
    inline_keyboard: InlineKeyboardButton[][];
}

/** --- sendMessage --- */

export interface SendMessageRequest {
    chat_id: number | string;
    text: string;
    business_connection_id?: string;
    message_thread_id?: number;
    parse_mode?: ParseMode;
    entities?: any[];
    link_preview_options?: LinkPreviewOptions;
    disable_notification?: boolean;
    protect_content?: boolean;
    allow_paid_broadcast?: boolean;
    message_effect_id?: string;
    reply_parameters?: ReplyParameters;
    reply_markup?: InlineKeyboardMarkup | object;
}

export interface SendMessageSuccessResult {
    message_id: number;
    from?: object;
    chat: object;
    date: number;
    text?: string;
    entities?: any[];
    [key: string]: any;
}

export type SendMessageResponse = SuccessResponse<SendMessageSuccessResult> | ErrorResponse;

/** --- sendDocument --- */

export interface SendDocumentRequest {
    chat_id: number | string;
    document: string | Blob;
    business_connection_id?: string;
    message_thread_id?: number;
    thumbnail?: string | Blob;
    caption?: string;
    parse_mode?: ParseMode;
    caption_entities?: any[];
    show_caption_above_media?: boolean;
    disable_content_type_detection?: boolean;
    disable_notification?: boolean;
    protect_content?: boolean;
    allow_paid_broadcast?: boolean;
    message_effect_id?: string;
    reply_parameters?: ReplyParameters;
    reply_markup?: InlineKeyboardMarkup | object;
}

export interface SendDocumentSuccessResult {
    message_id: number;
    document: {
        file_id: string;
        file_unique_id: string;
        file_name?: string;
        mime_type?: string;
        file_size?: number;
        thumbnail?: object;
    };
    from?: object;
    chat: object;
    date: number;
    [key: string]: any;
}

export type SendDocumentResponse = SuccessResponse<SendDocumentSuccessResult> | ErrorResponse;
