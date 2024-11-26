// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';
import {graphql, http, HttpResponse} from 'msw';
import {factory, primaryKey} from '@mswjs/data';
import {METRICS_URL} from '../constants.js';
import {AccountMetadata} from '../../src/index.js';

const db = factory({
    account: {
        accountId: primaryKey(String),
        count: Number,
    },
});

R.range(0, 100).forEach(i => {
    db.account.create({
        accountId: String(i).padStart(12, '0'),
        count: i * 100,
    });
});

db.account.create({
    accountId: 'aws',
    count: 50,
});

export const handlers = [
    graphql.query('GetAccounts', () => {
        return HttpResponse.json({
            data: {
                getAccounts: db.account.getAll().map(({accountId}) => {
                    return {
                        accountId,
                    };
                }),
            },
        });
    }),
    graphql.query('GetResourcesAccountMetadata', ({variables}) => {
        const {accounts} = variables;
        const result =
            accounts == null
                ? db.account.getAll()
                : db.account.findMany({
                      where: {
                          accountId: {
                              in: accounts.map(
                                  (x: AccountMetadata) => x.accountId
                              ),
                          },
                      },
                  });

        return HttpResponse.json({
            data: {
                getResourcesAccountMetadata: result,
            },
        });
    }),
    http.post(METRICS_URL, async ({request}) => {
        return HttpResponse.json({}, {status: 200});
    }),
];
