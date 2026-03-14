import { vi, describe, it, expect, beforeEach } from 'vitest';
import { run } from '../src/run';
import { ActionConfig } from '../src/action';
import { TelegramBot } from '../src/telegram';

vi.mock('@actions/core');
vi.mock('../src/telegram');
vi.mock('../src/utils', () => ({
    fileToBlob: vi.fn((path: string) => `blob:${path}`),
}));

describe('Run Orchestration', () => {
    const baseRaw = {
        bot_token: 'fake-token',
        chat_id: '12345',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call sendDocument when a single file is provided', async () => {
        const config = ActionConfig.fromRawInputs({
            ...baseRaw,
            document: 'README.md',
            document_caption: 'Check this out',
        });

        const spy = vi.spyOn(TelegramBot.prototype, 'sendDocument').mockResolvedValue({
            ok: true,
            // @ts-ignore
            result: { message_id: 200 },
        });

        await run(config);

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                document: 'blob:README.md',
                caption: 'Check this out',
            }),
        );
    });
});
