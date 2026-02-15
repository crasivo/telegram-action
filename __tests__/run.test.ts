import { jest } from '@jest/globals';
import * as core from '@actions/core';
import { run } from '../src/run';
import { ActionConfig } from '../src/action';
import { TelegramBot } from '../src/telegram';

// Мокаем зависимости GitHub Actions и TelegramBot
jest.mock('@actions/core');
jest.mock('../src/telegram');

// Мокаем утилиту fileToBlob, чтобы она возвращала путь как строку-заглушку (имитация Blob)
jest.mock('../src/utils', () => ({
    fileToBlob: jest.fn((path: string) => `blob:${path}`),
}));

describe('Run Orchestration', () => {
    const baseRaw = {
        bot_token: 'fake-token',
        chat_id: '12345',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call sendDocument when a single file is provided', async () => {
        const config = ActionConfig.fromRawInputs({
            ...baseRaw,
            document: 'README.md',
            document_caption: 'Check this out',
        });

        // @ts-ignore
        (TelegramBot.prototype.sendDocument as jest.Mock).mockResolvedValue({
            ok: true,
            result: { message_id: 200 },
        });

        await run(config);

        expect(TelegramBot.prototype.sendDocument).toHaveBeenCalledWith(
            expect.objectContaining({
                document: 'blob:README.md',
                caption: 'Check this out',
            }),
        );
    });

    test('should call sendMessage when only text is provided', async () => {
        const config = ActionConfig.fromRawInputs({
            ...baseRaw,
            message_text: 'Just a text message',
        });

        // @ts-ignore
        (TelegramBot.prototype.sendMessage as jest.Mock).mockResolvedValue({
            ok: true,
            result: { message_id: 300 },
        });

        await run(config);

        expect(TelegramBot.prototype.sendMessage).toHaveBeenCalledWith(
            expect.objectContaining({
                text: 'Just a text message',
            }),
        );
    });

    test('should report failure to GitHub Actions if Telegram API returns error', async () => {
        const config = ActionConfig.fromRawInputs({
            ...baseRaw,
            message_text: 'Trigger Error',
        });

        // @ts-ignore
        (TelegramBot.prototype.sendMessage as jest.Mock).mockResolvedValue({
            ok: false,
            description: 'Unauthorized',
            error_code: 401,
        });

        await run(config);

        expect(core.setFailed).toHaveBeenCalledWith(
            expect.stringContaining('❌ Telegram API Error: Unauthorized (Code: 401)'),
        );
    });
});
