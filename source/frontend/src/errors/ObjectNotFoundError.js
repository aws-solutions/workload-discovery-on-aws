// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export class ObjectNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ObjectNotFound';
    }
}