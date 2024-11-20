// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const exportJSON = diagramData => {
    return new Blob([JSON.stringify(diagramData)], {
        type: 'application/json;charset=utf-8',
    });
};
