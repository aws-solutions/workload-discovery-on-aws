// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {describe, it, expect, afterEach, vi} from "vitest";
import {within, screen, getByText, findByText, cleanup} from '@testing-library/react'
import {TableWrapper} from '@cloudscape-design/components/test-utils/dom';

import userEvent from "@testing-library/user-event";
import {renderPolarisLayout, getCellText} from "../../testUtils";

describe('Resource Details', () => {

    it('should display resource details', async () => {
        window.perspectiveMetadata = {
            version: '2.1.0'
        };

        vi.mock('@aws-amplify/ui-react', async () => {
            const mod = await vi.importActual('@aws-amplify/ui-react');
            return {
                ...mod,
                useAuthenticator: () => ({ user: {
                        username: 'testUser'
                    }, signOut: vi.fn() }),
            };
        });

        window.scrollTo = vi.fn();

        renderPolarisLayout();

        const group = screen.getByRole('group', {name: /explore/i, hidden: true});

        const resourcesLink = within(group).getByRole('link', {
            name: /resources/i,
            hidden: true
        });

        await userEvent.click(resourcesLink);

        await screen.findByRole('heading', {level: 2, name: /Resources \(29\)/});

        const subnet0Checkbox = screen.getByRole('checkbox', {
            name: /arn:aws:xxxxxxxxxxxx:eu-west-2:aws::ec2::subnet:0title is not selected/i
        });

        await userEvent.click(subnet0Checkbox);

        const openPanelButton = screen.getByRole('button', { name: /open panel/i });

        await screen.findByRole('heading', {name: /arn:aws:xxxxxxxxxxxx:eu-west-2:aws::ec2::subnet:0title/i});

        await userEvent.click(openPanelButton);

        await screen.findByRole('link', { name: /arn:aws:xxxxxxxxxxxx:eu-west-2:aws::ec2::subnet:0/i });

        // selecting multiple resources displays a table with a subset of details for each
        // selected resource
        const subnet1Checkbox = screen.getByRole('checkbox', {
            name: /arn:aws:xxxxxxxxxxxx:eu-west-2:aws::ec2::subnet:1title is not selected/i
        });

        await userEvent.click(subnet1Checkbox);

        await screen.findByRole('heading', {name: /2 resources selected/i});

        const resourcesDetailsTable = screen.getByRole('table', {
            name: /Resources Details/i
        });

        const resourcesDetailsTableWrapper = new TableWrapper(resourcesDetailsTable.parentElement);

        expect(getCellText(1, 1, resourcesDetailsTableWrapper)).toMatch(/Resource type/);
        expect(getCellText(2, 1, resourcesDetailsTableWrapper)).toMatch(/Account Id/);
        expect(getCellText(3, 1, resourcesDetailsTableWrapper)).toMatch(/Region/);
        expect(getCellText(4, 1, resourcesDetailsTableWrapper)).toMatch(/Availability zone/);

        expect(getCellText(1, 2, resourcesDetailsTableWrapper)).toBe('AWS::EC2::Subnet');
        expect(getCellText(2, 2, resourcesDetailsTableWrapper)).toBe('xxxxxxxxxxxx');
        expect(getCellText(3, 2, resourcesDetailsTableWrapper)).toBe('eu-west-2');
        expect(getCellText(4, 2, resourcesDetailsTableWrapper)).toBe('availabilityZone');

        expect(getCellText(1, 3, resourcesDetailsTableWrapper)).toBe('AWS::EC2::Subnet');
        expect(getCellText(2, 3, resourcesDetailsTableWrapper)).toBe('xxxxxxxxxxxx');
        expect(getCellText(3, 3, resourcesDetailsTableWrapper)).toBe('eu-west-2');
        expect(getCellText(4, 3, resourcesDetailsTableWrapper)).toBe('availabilityZone');

    });

});