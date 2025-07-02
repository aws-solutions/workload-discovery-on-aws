import {defineConfig, transformWithEsbuild} from 'vite';
import eslint from 'vite-plugin-eslint2';
import path from 'node:path';
import fs from 'node:fs/promises';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';

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
                global: 'globalThis', //<-- AWS SDK
            },
        },
    },
    plugins: [
        eslint(),
        excludeMsw(),
        react(),
        svgrPlugin(),
        {
            name: 'load+transform-js-files-as-jsx',
            async transform(code, id) {
                if (!id.match(/src\/.*\.m?js$/)) {
                    return null;
                }

                return transformWithEsbuild(code, id, {
                    loader: 'jsx',
                    jsx: 'automatic',
                });
            },
        },
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
        coverage: {
            provider: 'v8',
            reporter: [
                ['lcov', {projectRoot: '../..'}],
                ['html'],
                ['text'],
                ['json'],
            ],
        },
    },
});
