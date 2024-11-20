// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export const useSplitPanel = open => {
    const [splitPanelSize, setSplitPanelSize] = React.useState(300);
    const [splitPanelOpen, setSplitPanelOpen] = React.useState(open);
    const [splitPanelPreferences, setSplitPanelPreferences] = React.useState({
        position: 'bottom',
    });
    const [hasManuallyClosedOnce, setHasManuallyClosedOnce] =
        React.useState(false);

    const onSplitPanelResize = ({detail: {size}}) => {
        setSplitPanelSize(size);
    };

    const onSplitPanelToggle = ({detail: {open}}) => {
        setSplitPanelOpen(open);

        if (!open) {
            setHasManuallyClosedOnce(true);
        }
    };

    const onSplitPanelPreferencesChange = ({detail}) => {
        setSplitPanelPreferences(detail);
    };

    React.useEffect(() => {
        if (open && !hasManuallyClosedOnce) {
            setSplitPanelOpen(true);
        }
    }, [open, hasManuallyClosedOnce]);

    return {
        splitPanelOpen,
        onSplitPanelToggle,
        splitPanelSize,
        splitPanelPreferences,
        onSplitPanelResize,
        onSplitPanelPreferencesChange,
        setSplitPanelPreferences,
    };
};
