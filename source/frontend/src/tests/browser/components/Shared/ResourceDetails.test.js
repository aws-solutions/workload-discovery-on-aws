// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {describe, expect} from 'vitest';
import {it} from '../../../vitest/setupFiles/testContext';
import {render} from 'vitest-browser-react';
import {TableWrapper} from '@cloudscape-design/components/test-utils/dom';
import {
    createSelfManagedPerspectiveMetadata,
    getCellContent,
    sleep,
} from '../../../vitest/testUtils';
import App from '../../../../App';

describe('Resource Details', () => {
    it('should display resource details', async () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const screen = render(<App />);

        await screen
            .getByRole('group', {
                name: /explore/i,
            })
            .getByRole('link', {
                name: /resources/i,
            })
            .click();

        await expect
            .element(
                screen.getByRole('heading', {
                    level: 2,
                    name: /Resources \(29\)/,
                })
            )
            .toBeInTheDocument();

        await screen
            .getByRole('checkbox', {
                name: /arn:aws:xxxxxxxxxxxx:eu-west-2:aws::ec2::subnet:0title is not selected/i,
            })
            .click();

        const openPanelButton = screen.getByRole('button', {
            name: /open panel/i,
        });

        await openPanelButton.click();

        await expect
            .element(
                screen.getByRole('heading', {
                    name: /arn:aws:xxxxxxxxxxxx:eu-west-2:aws::ec2::subnet:0title/i,
                })
            )
            .toBeInTheDocument();

        screen.getByLabelText('green status icon');

        const closePanelButton = screen.getByRole('button', {
            name: /close panel/i,
        });

        await closePanelButton.click();

        // selecting multiple resources displays a table with a subset of details for each
        // selected resource
        await screen
            .getByRole('checkbox', {
                name: /arn:aws:xxxxxxxxxxxx:eu-west-2:aws::ec2::subnet:1title is not selected/i,
            })
            .click();

        await expect
            .element(
                screen.getByRole('heading', {name: /2 resources selected/i})
            )
            .toBeInTheDocument();

        await openPanelButton.click();

        const resourcesDetailsTable = screen.getByRole('table', {
            name: /Resources Details/i,
        });

        await expect.element(resourcesDetailsTable).toBeInTheDocument();

        const resourcesDetailsTableWrapper = new TableWrapper(
            resourcesDetailsTable.element().parentElement
        );

        expect(getCellContent(resourcesDetailsTableWrapper, 1, 1)).toMatch(
            /Resource type/
        );
        expect(getCellContent(resourcesDetailsTableWrapper, 2, 1)).toMatch(
            /Account Id/
        );
        expect(getCellContent(resourcesDetailsTableWrapper, 3, 1)).toMatch(
            /Region/
        );
        expect(getCellContent(resourcesDetailsTableWrapper, 4, 1)).toMatch(
            /Availability zone/
        );

        expect(getCellContent(resourcesDetailsTableWrapper, 1, 2)).toBe(
            'AWS::EC2::Subnet'
        );
        expect(getCellContent(resourcesDetailsTableWrapper, 2, 2)).toBe(
            'xxxxxxxxxxxx'
        );
        expect(getCellContent(resourcesDetailsTableWrapper, 3, 2)).toBe(
            'eu-west-2'
        );
        expect(getCellContent(resourcesDetailsTableWrapper, 4, 2)).toBe(
            'availabilityZone'
        );

        expect(getCellContent(resourcesDetailsTableWrapper, 1, 3)).toBe(
            'AWS::EC2::Subnet'
        );
        expect(getCellContent(resourcesDetailsTableWrapper, 2, 3)).toBe(
            'xxxxxxxxxxxx'
        );
        expect(getCellContent(resourcesDetailsTableWrapper, 3, 3)).toBe(
            'eu-west-2'
        );
        expect(getCellContent(resourcesDetailsTableWrapper, 4, 3)).toBe(
            'availabilityZone'
        );
    });
});
