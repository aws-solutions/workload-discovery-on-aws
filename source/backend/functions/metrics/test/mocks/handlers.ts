// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {graphql, http, HttpResponse} from 'msw';
import {Collection} from '@msw/data';
import {z} from 'zod';
import {METRICS_URL} from '../constants.js';
import {AccountMetadata} from '../../src/index.js';

const accounts = new Collection({
    schema: z.object({
        accountId: z.string(),
        count: z.number(),
    }),
});

await accounts.createMany(100, i => ({
    accountId: String(i).padStart(12, '0'),
    count: i * 100,
}));

await accounts.create({
    accountId: 'aws',
    count: 50,
});

export const handlers = [
    graphql.query('GetAccounts', () => {
        return HttpResponse.json({
            data: {
                getAccounts: accounts
                    .findMany()
                    .map(({accountId}) => ({accountId})),
            },
        });
    }),
    graphql.query('GetResourcesAccountMetadata', ({variables}) => {
        const accountFilter = variables.accounts as
            | AccountMetadata[]
            | null
            | undefined;
        const ids =
            accountFilter == null
                ? null
                : new Set(accountFilter.map(x => x.accountId));
        const result =
            ids == null
                ? accounts.findMany()
                : accounts.findMany(q =>
                      q.where({accountId: id => ids.has(id)})
                  );

        return HttpResponse.json({
            data: {
                getResourcesAccountMetadata: result,
            },
        });
    }),
    http.post(METRICS_URL, async () => {
        return HttpResponse.json({}, {status: 200});
    }),
];
