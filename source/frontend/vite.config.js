import { defineConfig } from 'vite';
import fs from 'node:fs/promises';
import esbuild from 'esbuild';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: "globalThis", //<-- AWS SDK
            },
        },
    },
    plugins: [
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
        alias: {
            './runtimeConfig': './runtimeConfig.browser',
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