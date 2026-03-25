// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

const WebGLContext = createContext();
const WEBGL_STORAGE_KEY = 'webGLEnabled';

export const useWebGLState = () => {
    const context = useContext(WebGLContext);
    if (!context) {
        throw new Error('useWebGLState must be used within a WebGLProvider');
    }
    return context;
};

export const WebGLProvider = ({ children }) => {
    // Initialize from localStorage if available, otherwise default to false
    const [webGLEnabled, setWebGLEnabled] = useState(() => {
        try {
            const stored = localStorage.getItem(WEBGL_STORAGE_KEY);
            return stored === 'true';
        } catch (error) {
            console.warn('Failed to read WebGL preference from localStorage:', error);
            return false;
        }
    });

    // Save to localStorage whenever the state changes
    useEffect(() => {
        try {
            localStorage.setItem(WEBGL_STORAGE_KEY, webGLEnabled.toString());
        } catch (error) {
            console.warn('Failed to save WebGL preference to localStorage:', error);
        }
    }, [webGLEnabled]);

    const toggleWebGL = useCallback((newValue) => {
        setWebGLEnabled(newValue);
    }, []);

    const contextValue = useMemo(() => ({
        webGLEnabled,
        toggleWebGL
    }), [webGLEnabled, toggleWebGL]);

    return (
        <WebGLContext.Provider value={contextValue}>
            {children}
        </WebGLContext.Provider>
    );
};
