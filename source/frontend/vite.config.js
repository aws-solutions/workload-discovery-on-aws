import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint2'
import path from 'node:path';
import fs from 'node:fs/promises';
import esbuild from 'esbuild';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import istanbul from "vite-plugin-istanbul";

function excludeMsw() {
    return {
        name: "exclude-msw",
        resolveId(source) {
            return source === "virtual-module" ? source : null;
        },
        async renderStart(outputOptions, _inputOptions) {
            const outDir = outputOptions.dir;
            const msWorker = path.resolve(outDir, "mockServiceWorker.js");
            await fs.rm(msWorker);
        },
    };
}

export default defineConfig({
    build: {
        sourcemap: true,
        rollupOptions: {
            external: [
                '/settings.js'
            ],
        }
    },
    esbuild: {
        loader: 'jsx',
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
                '.ts': 'tsx',
            },
            // Node.js global to browser globalThis
            define: {
                global: "globalThis", //<-- AWS SDK
            },
        },
    },
    plugins: [
        eslint(),
        excludeMsw(),
        react(),
        svgrPlugin(),
        {
            name: 'load-js-files-as-jsx',
            async load(id) {
                if (!id.match(/src\/.*\.js$/)) {
                    return
                }

                const file = await fs.readFile(id, 'utf-8')
                return esbuild.transformSync(file, { loader: 'jsx' })
            }
        },
        // this plugin is require to instrument the code running in a browser for
        // the Cypress tests
        istanbul({
            cypress: true,
            requireEnv: false,
        }),
    ],
    resolve: {
        // this is required for Amplify
        alias: {
            './runtimeConfig': './runtimeConfig.browser',
        },
    },
    'import/resolver': {
        node: {
            paths: ['src'],
            extensions: ['.js', '.jsx'],
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: [
            './src/tests/vitest/setupFiles/amplify.js',
            './src/tests/vitest/setupFiles/cleanup.js',
            './src/tests/vitest/setupFiles/globals.js',
            './src/tests/vitest/setupFiles/server.js',
            './src/tests/vitest/setupFiles/jest-dom.js',
        ],
        coverage: {
            provider: 'v8',
            reportsDirectory: 'vitest-coverage',
            reporter: [
                ['lcov', { 'projectRoot': '../..' }],
                ['html'],
                ['text'],
                ['json']
            ]
        }
    }
});
