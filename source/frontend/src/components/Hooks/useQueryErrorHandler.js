// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {hashProperty} from '../../Utils/ObjectUtils';
import {useNotificationDispatch} from '../Contexts/NotificationContext';

const useQueryErrorHandler = () => {
    const {addNotification} = useNotificationDispatch();
    const handleError = e => {
        const error = e.error ? e.error : e;
        if (error?.name) {
            let notification;
            switch (error.name) {
                case 'InvalidRequestException':
                    notification = {
                        header: 'Invalid Request',
                        content: (
                            <>
                                The following errors occurred:
                                <ul>
                                    {error.errors.map(i => (
                                        <li key={hashProperty(i.name)}>
                                            {i.message}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ),
                        type: 'error',
                    };
                    break;
                case 'AccessDeniedException':
                    notification = {
                        header: 'Access Denied',
                        content:
                            'You are not authorised to perform the requested action',
                        type: 'error',
                    };
                    break;
                case 'ObjectNotFound':
                    notification = {
                        header: 'Not Found',
                        content: `The requested resource could not be found.`,
                        type: 'error',
                    };
                    break;
                case 'ExpiredTokenException':
                    notification = {
                        header: 'Session Expired',
                        content:
                            'User session has expired. Please refresh the page or sign in again.',
                        type: 'error',
                    };
                    break;
                default:
                    notification = {
                        header: error.name,
                        content: error.message,
                        type: 'error',
                    };
                    break;
            }
            if (notification) addNotification(notification);
        } else {
            addNotification({
                content: 'An unknown error occurred',
                type: 'error',
            });
        }
        window.scrollTo(0, 0);
        return e;
    };

    return {handleError};
};

export default useQueryErrorHandler;
