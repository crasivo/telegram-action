import * as core from '@actions/core';
import { ActionConfig } from './action';
import { run } from './run';

/**
 * Entry point for the GitHub Action.
 * Initializes the configuration and starts the run process.
 *
 * @returns {Promise<any|void>}
 */
async function main(): Promise<void> {
    try {
        const config = ActionConfig.fromGithubInput();
        await run(config);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

main();
