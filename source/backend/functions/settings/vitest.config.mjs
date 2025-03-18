import {defineConfig} from 'vite';

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            reporter: [
                ['lcov', {projectRoot: '../../../..'}],
                ['html'],
                ['text'],
                ['json'],
            ],
        },
    },
});
