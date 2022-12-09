// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const getStatus = (isFetching, isError) => isFetching ? 'loading' : isError ? 'error' : 'finished';