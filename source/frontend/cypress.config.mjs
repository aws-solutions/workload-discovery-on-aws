import { defineConfig } from 'cypress'
import { initPlugin } from "@frsource/cypress-plugin-visual-regression-diff/plugins";
import codeCoverageTask from '@cypress/code-coverage/task.js';

export default defineConfig({
    viewportWidth: 1280,
    viewportHeight: 720,
    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite'
        },
        setupNodeEvents(on, config) {
            codeCoverageTask(on, config);
            initPlugin(on, config);

            return config;
        },
        indexHtmlFile: 'cypress/support/component-index.html',
        supportFile: 'cypress/support/component.js',
    }
})