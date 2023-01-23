import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint'
import fs from 'node:fs/promises';
import esbuild from 'esbuild';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
    build: {
        rollupOptions: {
            external: [
                '/settings.js'
            ],
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: "globalThis", //<-- AWS SDK
            },
        },
    },
    plugins: [
        eslint(),
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
        }
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
        // Vitest will have projectRoot functionality like Jest soon:
        // https://github.com/vitest-dev/vitest/issues/1902
        coverage: {
            reporter: ['lcov', "html"]
        }
    }
});