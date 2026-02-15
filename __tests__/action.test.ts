import { ActionConfig } from '../src/action';

describe('ActionConfig Parsing logic', () => {
    const baseInputs = {
        bot_token: 'fake-token',
        chat_id: '12345',
    };

    test('should prioritize link button over raw reply_markup', () => {
        const config = ActionConfig.fromRawInputs({
            ...baseInputs,
            reply_link_url: 'https://google.com',
            reply_link_text: 'Google',
            reply_markup: '{"inline_keyboard": [[{"text": "Ignore Me", "url": "..."}]]}',
        });

        expect(config.replyMarkup).toEqual({
            inline_keyboard: [[{ text: 'Google', url: 'https://google.com' }]],
        });
    });

    test('should determine correct ActionMethod', () => {
        const textConfig = ActionConfig.fromRawInputs({ ...baseInputs, message_text: 'Hi' });
        const docConfig = ActionConfig.fromRawInputs({ ...baseInputs, document: 'file.txt' });

        expect(textConfig.getActionMethod()).toBe('sendMessage');
        expect(docConfig.getActionMethod()).toBe('sendDocument');
    });

    test('should throw error if no content is provided', () => {
        const emptyConfig = ActionConfig.fromRawInputs(baseInputs);
        expect(() => emptyConfig.getActionMethod()).toThrow(/No valid content found/);
    });
});
