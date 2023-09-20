import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        include: ['test/*.mjs'],
        coverage: {
            reporter: [
                ['lcov', { 'projectRoot': '../../..' }],
                ['html'],
                ['text']
            ]
        }
    }
});
