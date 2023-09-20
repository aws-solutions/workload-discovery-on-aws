// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import App from '../../../../../App';

describe('Resources Page', () => {

    it('should add resources to diagram page', () => {
        window.perspectiveMetadata = {version: '2.1.0'};

        cy.mount(<App />);

        cy.findByRole('link', { name: /Resources$/, hidden: true }).click();

        cy.findByRole('heading', {level: 2, name: /\(29\)/i});

        cy.findByPlaceholderText('Find a resource').type('lambda');

        cy.findByRole('checkbox', { name: /arn:aws:yyyyyyyyyyyy:eu-west-1:AWS::Lambda::Function:0Title is not selected/i }).click();

        cy.findByRole('button', { name: /add to diagram/i }).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', { name: /name/i }).type('TestDiagram');

        cy.findByRole('button', { name: /create/i }).click();

        cy.get('.expand-collapse-canvas').should('be.visible');

        /* eslint-disable */
        cy.wait(2000);
        /* eslint-disable */

        cy.get('.expand-collapse-canvas').matchImage({maxDiffThreshold: 0.1});
    })
});