import { describe, it, beforeAll, afterEach, vi } from 'vitest';
import * as dotenv from 'dotenv';
import { run } from '../src/run.js';
import { ActionConfig } from '../src/action';

dotenv.config();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Real World Debugging Sessions', () => {
    const inputs = {
        bot_token: process.env.TELEGRAM_BOT_TOKEN!,
        chat_id: process.env.TELEGRAM_CHAT_ID!,
    };

    beforeAll(() => {
        if (!inputs.bot_token || !inputs.chat_id) {
            console.error('❌ Missing environment variables! Check your .env file.');
            throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not defined');
        }
    });

    afterEach(async () => {
        console.log('--- Sleeping 2s to respect rate limits ---');
        await sleep(2000);
    });

    it('DEBUG: Send Text with Link Button', async () => {
        const config = ActionConfig.fromRawInputs({
            ...inputs,
            message_text: '🔗 *Debug*: Message with a Button (Vitest)',
            parse_mode: 'Markdown',
            reply_link_text: 'Go to Repository',
            reply_link_url: 'https://github.com/crasivo/telegram-action',
        });

        console.log(`[1] Executing method: ${config.getActionMethod()}`);
        await run(config);
    });

    it('DEBUG: Send Single Document', async () => {
        const config = ActionConfig.fromRawInputs({
            ...inputs,
            document: 'package.json',
            document_caption: '📄 *Debug*: Single Document (Vitest)',
            parse_mode: 'Markdown',
            reply_link_text: 'Go to Repository',
            reply_link_url: 'https://github.com/crasivo/telegram-action',
        });

        console.log(`[2] Executing method: ${config.getActionMethod()}`);
        await run(config);
    });
});