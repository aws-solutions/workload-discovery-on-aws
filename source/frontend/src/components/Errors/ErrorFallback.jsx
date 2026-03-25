// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {Box, Button, Icon, SpaceBetween} from '@cloudscape-design/components';

function ErrorFallback({error, resetErrorBoundary}) {
    return (
        <Box padding={'xxxl'} textAlign={'center'}>
            <SpaceBetween size={'m'}>
                <Icon
                    variant={'error'}
                    name={'status-negative'}
                    size={'large'}
                />
                <Box variant={'h1'}>Something went wrong!</Box>
                <Box color={'text-body-secondary'}>{error.message}</Box>
                <Button onClick={resetErrorBoundary}>Reload</Button>
            </SpaceBetween>
        </Box>
    );
}

export default ErrorFallback;
