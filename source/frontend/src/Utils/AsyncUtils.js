// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const delay = (retryCount) =>
    new Promise((resolve) => {
        setTimeout(resolve, Math.max(retryCount * 2, 1) * 1000)
        }
    );