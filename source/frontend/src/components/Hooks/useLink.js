// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {useCallback} from 'react';
import {useNavigate} from 'react-router';

export default function useLink() {
    const navigate = useNavigate();

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
                navigate(e.detail.href);
            },
            [navigate]
        ),
    };
}
