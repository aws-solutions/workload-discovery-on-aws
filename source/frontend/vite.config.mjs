import {defineConfig} from 'vite';
import {playwright} from '@vitest/browser-playwright';
import eslint from 'vite-plugin-eslint2';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs/promises';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function excludeMsw() {
    return {
        name: 'exclude-msw',
        resolveId(source) {
            return source === 'virtual-module' ? source : null;
        },
        async renderStart(outputOptions, _inputOptions) {
            const outDir = outputOptions.dir;
            const msWorker = path.resolve(outDir, 'mockServiceWorker.js');
            await fs.rm(msWorker);
        },
    };
}

export default defineConfig({
    build: {
        sourcemap: true,
        rollupOptions: {
            external: ['/settings.js'],
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis', //<-- AWS SDK
            },
        },
    },
    plugins: [
        eslint(),
        excludeMsw(),
        react(),
        svgrPlugin(),
    ],
    resolve: {},
    'import/resolver': {
        node: {
            paths: ['src'],
            extensions: ['.js', '.jsx'],
        },
    },
    test: {
        coverage: {
            provider: 'v8',
            reporter: [
                ['lcov', {projectRoot: '../..'}],
                ['html'],
                ['text'],
                ['json'],
            ],
        },
        projects: [
            {
                extends: './vite.config.mjs',
                test: {
                    name: 'jsdom',
                    include: ['src/tests/vitest/**/*.{test,spec}.{js,jsx}'],
                    environment: 'jsdom',
                    setupFiles: [
                        './src/tests/vitest/setupFiles/amplify.js',
                        './src/tests/vitest/setupFiles/cleanup.js',
                        './src/tests/vitest/setupFiles/globals.js',
                        './src/tests/vitest/setupFiles/server.js',
                        './src/tests/vitest/setupFiles/jest-dom.js',
                    ],
                },
            },
            {
                extends: './vite.config.mjs',
                resolve: {
                    alias: {
                        'aws-amplify/storage': path.resolve(
                            __dirname,
                            'src/tests/mocks/aws-amplify-storage.js'
                        ),
                    },
                },
                test: {
                    fileParallelism: false,
                    include: ['src/tests/browser/**/*.{test,spec}.{js,jsx}'],
                    exclude: ['src/tests/browser/components/Diagrams/Draw/DrawDiagram/DrawDiagramPageExport.test.jsx'],
                    setupFiles: [
                        './src/tests/vitest/setupFiles/amplify-browser.js',
                    ],
                    name: 'browser',
                    browser: {
                        viewport: {height: 1500, width: 3000},
                        provider: playwright(),
                        enabled: true,
                        headless: true,
                        instances: [{browser: 'chromium'}],
                        expect: {
                            toMatchScreenshot: {
                                comparatorName: 'pixelmatch',
                                comparatorOptions: {
                                    threshold: 0.1,
                                },
                            },
                        },
                    },
                },
            },
        ],
    },
});
