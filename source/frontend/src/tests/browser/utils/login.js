// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {expect} from 'vitest';

export async function login(screen) {
    const nav = screen.getByRole('navigation');
    const signIn = screen.getByRole('button', {name: /sign in/i});

    // Wait for the Authenticator to settle into either the sign-in form
    // or the authenticated app content.
    await expect.poll(() => nav.query() !== null || signIn.query() !== null).toBe(true);

    if (signIn.query()) {
        await screen.getByRole('textbox', {name: /username/i}).fill('testUser');
        await screen.getByLabelText(/^password$/i).fill('testPassword');
        await signIn.click();
    }

    await nav;
}
