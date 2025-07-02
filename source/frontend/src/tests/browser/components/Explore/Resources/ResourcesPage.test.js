// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {render} from 'vitest-browser-react';
import {describe, expect} from 'vitest';
import {it} from '../../../../vitest/setupFiles/testContext';
import App from '../../../../../App';
import {sleep} from '../../../../vitest/testUtils';

describe('Resources Page', () => {
    it('should add resources to diagram page', async () => {
        window.perspectiveMetadata = {version: '2.3.0'};

        const screen = render(<App />);

        await screen
            .getByRole('link', {name: /Resources$/, hidden: true})
            .click();

        await screen.getByRole('heading', {level: 2, name: /\(29\)/i});

        await screen
            .getByRole('searchbox', {name: 'Find a resource', exact: true})
            .fill('lambda');

        await screen
            .getByRole('checkbox', {
                name: /arn:aws:yyyyyyyyyyyy:eu-west-1:AWS::Lambda::Function:0Title is not selected/i,
            })
            .click();

        await screen.getByRole('button', {name: /add to diagram/i}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        await screen.getByRole('combobox', {name: /name/i}).fill('TestDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        const canvas = await screen.getByTestId('wd-cytoscape-canvas');

        // wait for diagram animations on canvas to complete
        await sleep(2000);

        const screenshotPath = await canvas.screenshot({
            scale: 'device',
        });

        await expect(screenshotPath).toMatchImageSnapshot({
            maxDiffPercentage: 7.5,
        });
    });
});
