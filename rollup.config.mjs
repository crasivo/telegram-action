import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

/**
 * Rollup configuration for building the GitHub Action.
 * Compiles TypeScript and bundles all dependencies into a single file.
 */
export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/main.js',
        format: 'es',
        sourcemap: false,
    },
    plugins: [
        resolve({
            exportConditions: ['node'],
            preferBuiltins: true,
        }),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            exclude: ['__tests__/**', 'src/**/*.test.ts'],
        }),
    ],
};
