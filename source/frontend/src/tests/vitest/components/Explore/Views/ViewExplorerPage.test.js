// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {screen} from '@testing-library/react';
import {TableWrapper} from '@cloudscape-design/components/test-utils/dom';
import React from 'react';
import {describe, expect, vi, it} from 'vitest';
import userEvent from '@testing-library/user-event';
import {
    createSelfManagedPerspectiveMetadata,
    renderPolarisLayout,
} from '../../../testUtils';

function getCellText(table, row, column) {
    return table.findBodyCell(row, column).getElement()?.innerHTML;
}

describe('View Page', () => {
    it('should create new view', async () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        vi.mock('@aws-amplify/ui-react', async () => {
            const mod = await vi.importActual('@aws-amplify/ui-react');
            return {
                ...mod,
                useAuthenticator: () => ({
                    user: {
                        username: 'testUser',
                    },
                    signOut: vi.fn(),
                }),
            };
        });

        window.scrollTo = vi.fn();

        const user = userEvent.setup();

        renderPolarisLayout();

        const viewsLink = screen.getByRole('link', {
            name: /Views$/,
            hidden: true,
        });
        await user.click(viewsLink);

        await user.click(await screen.findByRole('button', {name: /create/i}));

        const accountFilterButton = screen.getByRole('button', {
            name: /accounts choose accounts to filter by/i,
        });
        await user.click(accountFilterButton);

        const filterOption = await screen.findByRole('option', {
            name: /xxxxxxxxxxxx/i,
        });
        await user.click(filterOption);

        const viewNameTextBox = screen.getByRole('textbox', {name: /name/i});
        await userEvent.type(viewNameTextBox, 'TestView');

        await screen.findByRole('heading', {
            level: 2,
            name: /Resources types \(6\)/,
        });

        const subnetCheckbox = screen.getByRole('checkbox', {
            name: /aws::ec2::subnet is not selected/i,
        });

        await user.click(subnetCheckbox);

        const saveButton = screen.getByRole('button', {name: /save/i});
        await user.click(saveButton);

        await screen.findByRole(
            'heading',
            {level: 2, name: /Resources \(2\)/},
            {timeout: 2000}
        );

        const accountsTable = screen.getByRole('table', {
            name: /accounts/i,
        });

        const accountsTableWrapper = new TableWrapper(
            accountsTable.parentElement
        );
        const accountsTableRows = accountsTableWrapper.findRows();

        expect(accountsTableRows).toHaveLength(1);

        expect(getCellText(accountsTableWrapper, 1, 1)).toMatch(/xxxxxxxxxxxx/);

        const resourcesTypeTable = screen.getByRole('table', {
            name: /resources types/i,
        });

        const resourcesTypeTableWrapper = new TableWrapper(
            resourcesTypeTable.parentElement
        );
        const resourcesTypeTableRows = resourcesTypeTableWrapper.findRows();

        expect(resourcesTypeTableRows).toHaveLength(1);

        expect(getCellText(resourcesTypeTableWrapper, 1, 1)).toMatch(
            /\/icons\/VPC-subnet-private_light-bg-menu.svg/
        );
        expect(getCellText(resourcesTypeTableWrapper, 1, 2)).toMatch(
            /AWS::EC2::Subnet/
        );

        // verify that only subnets are rendered
        const resourcesTable = screen.getByRole('table', {name: /resources$/i});

        const resourcesTableWrapper = new TableWrapper(
            resourcesTable.parentElement
        );
        const resourcesTableRows = resourcesTableWrapper.findRows();

        expect(resourcesTableRows).toHaveLength(2);

        expect(getCellText(resourcesTableWrapper, 1, 2)).toMatch(
            /\/icons\/VPC-subnet-private_light-bg-menu.svg/
        );
        expect(getCellText(resourcesTableWrapper, 1, 3)).toBe(
            'arn:aws:xxxxxxxxxxxx:eu-west-2:AWS::EC2::Subnet:0Title'
        );
        expect(getCellText(resourcesTableWrapper, 1, 4)).toBe(
            'AWS::EC2::Subnet'
        );
        expect(getCellText(resourcesTableWrapper, 1, 5)).toBe('xxxxxxxxxxxx');
        expect(getCellText(resourcesTableWrapper, 1, 6)).toBe('eu-west-2');

        expect(getCellText(resourcesTableWrapper, 2, 2)).toMatch(
            /\/icons\/VPC-subnet-private_light-bg-menu.svg/
        );
        expect(getCellText(resourcesTableWrapper, 2, 3)).toBe(
            'arn:aws:xxxxxxxxxxxx:eu-west-2:AWS::EC2::Subnet:1Title'
        );
        expect(getCellText(resourcesTableWrapper, 2, 4)).toBe(
            'AWS::EC2::Subnet'
        );
        expect(getCellText(resourcesTableWrapper, 2, 5)).toBe('xxxxxxxxxxxx');
        expect(getCellText(resourcesTableWrapper, 2, 6)).toBe('eu-west-2');
    }, 8000);
});
