// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {screen} from '@testing-library/react';
import {describe, expect, vi, it} from 'vitest';
import userEvent from '@testing-library/user-event';
import {
    createSelfManagedPerspectiveMetadata,
    renderPolarisLayout,
} from '../../../../../testUtils';

describe('Create Diagram Page', () => {
    it('should have public and private visibility option', async () => {
        HTMLCanvasElement.prototype.getContext = vi.fn();
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

        const manageLink = screen.getByRole('link', {
            name: /Manage$/,
            hidden: true,
        });
        await user.click(manageLink);

        await user.click(await screen.findByRole('button', {name: /create/i}));

        await screen.findByRole('heading', {level: 2, name: /Create Diagram/i});

        await user.click(await screen.findByRole('button', {name: /create/i}));

        screen.getByLabelText(/Visibility/i);

        const visibilityButton = screen.getByRole('button', {
            name: /visibility private/i,
        });

        await user.click(visibilityButton);

        const publicOption = screen.getByRole('option', {name: /public/i});

        await user.click(publicOption);

        const createButton = screen.getByRole('button', {name: /create/i});

        expect(createButton).toBeDisabled();

        const nameComboBox = screen.getByRole('combobox', {name: /name/i});
        await userEvent.type(nameComboBox, 'TestDiagram');

        expect(createButton).toBeEnabled();
    });
});
