// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render} from '@testing-library/react';
import {WebGLProvider, useWebGLState} from '../../../../components/Contexts/WebGLContext';

// Test component to access the context
const TestComponent = () => {
    const {webGLEnabled, toggleWebGL} = useWebGLState();
    return (
        <div>
            <span>{webGLEnabled.toString()}</span>
            <button onClick={() => toggleWebGL(true)}>
                Enable
            </button>
        </div>
    );
};

describe('WebGLContext', () => {
    beforeEach(() => {
        vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('localStorage read error handling', () => {
        it('should handle localStorage.getItem error and default to false', () => {
            vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                throw new Error('localStorage access denied');
            });

            const {container} = render(
                <WebGLProvider>
                    <TestComponent />
                </WebGLProvider>
            );

            expect(container.querySelector('span')).toHaveTextContent('false');
            expect(console.warn).toHaveBeenCalledWith(
                'Failed to read WebGL preference from localStorage:',
                expect.any(Error)
            );
        });
    });

    describe('localStorage write error handling', () => {
        it('should handle localStorage.setItem error when toggling WebGL', () => {
            vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('false');
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new Error('localStorage write denied');
            });

            const {getByRole} = render(
                <WebGLProvider>
                    <TestComponent />
                </WebGLProvider>
            );

            getByRole('button').click();

            expect(console.warn).toHaveBeenCalledWith(
                'Failed to save WebGL preference to localStorage:',
                expect.any(Error)
            );
        });
    });
});