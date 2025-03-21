// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {useCallback} from 'react';
import {useHistory} from 'react-router-dom';

export default function useLink() {
    const history = useHistory();

    return {
        handleFollow: useCallback(
            e => {
                if (
                    e.detail.external === true ||
                    typeof e.detail.href === 'undefined'
                ) {
                    return;
                }
                if (typeof e.preventDefault === 'function') e.preventDefault();
                history.push(e.detail.href);
            },
            [history]
        ),
    };
}
