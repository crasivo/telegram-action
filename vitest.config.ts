import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['__tests__/**/*.{test,debug}.ts'],
        exclude: ['**/node_modules/**', '**/dist/**'],
        alias: {
            '@src': '/src',
        },
    },
});