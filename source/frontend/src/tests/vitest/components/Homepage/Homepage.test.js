// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {describe, it, vi, expect} from 'vitest';
import {screen, within} from '@testing-library/react';
import {
    createOrganizationsPerspectiveMetadata,
    createSelfManagedPerspectiveMetadata,
    renderPolarisLayout,
} from '../../testUtils';

describe('Homepage', () => {
    it('should have import button on home page in self managed mode', async () => {
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

        renderPolarisLayout();

        screen.getByText(
            /get started by importing regions from one or more of your accounts\./i
        );

        screen.getByRole('button', {name: /import/i});
    });

    it('should not have import button on home page in organizations mode', async () => {
        window.perspectiveMetadata = createOrganizationsPerspectiveMetadata();

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

        renderPolarisLayout();

        const importText = screen.queryByText(
            /get started by importing regions from one or more of your accounts\./i
        );
        expect(importText).toBeNull();

        const importButton = screen.queryByRole('button', {name: /import/i});
        expect(importButton).toBeNull();
    });
});
