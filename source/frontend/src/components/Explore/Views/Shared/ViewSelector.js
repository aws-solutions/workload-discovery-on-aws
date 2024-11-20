// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect} from 'react';
import {
    Button,
    Container,
    Form,
    FormField,
    Header,
    Select,
    SpaceBetween,
} from '@cloudscape-design/components';
import {CREATE_VIEW, EDIT_VIEW, VIEW, VIEWS} from '../../../../routes';
import {useHistory, useParams} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    privateLevel,
    useListObjects,
    useObject,
    useRemoveObject,
    viewsPrefix,
} from '../../../Hooks/useS3Objects';
import * as R from 'ramda';

const ViewSelector = ({selectedOption, onSelect}) => {
    const {name} = useParams();
    const {
        data: views = [],
        refetch,
        status,
    } = useListObjects(viewsPrefix, privateLevel);
    const {data: viewData, isLoading} = useObject(
        name,
        viewsPrefix,
        privateLevel,
        {enabled: !!name}
    );
    const {removeAsync} = useRemoveObject(viewsPrefix);
    const history = useHistory();
    const options = R.map(e => {
        return {label: R.split('/', e.key)[1], value: e.key};
    }, views);

    useEffect(() => {
        if (viewData && name) {
            onSelect(R.assoc('key', name, viewData));
        } else {
            onSelect(null);
        }
    }, [name, onSelect, viewData]);

    const onViewSelected = detail => {
        history.replace(VIEW.replace(':name', detail.selectedOption.label));
    };

    return (
        <Container
            header={
                <Header
                    variant="h2"
                    actions={
                        <SpaceBetween size={'s'} direction={'horizontal'}>
                            <Button
                                disabled={R.isNil(selectedOption)}
                                onClick={async () => {
                                    history.push(VIEWS);
                                    return removeAsync({
                                        key: selectedOption,
                                        level: privateLevel,
                                    }).then(() => onSelect({}));
                                }}
                            >
                                Delete
                            </Button>
                            <Button
                                disabled={R.isNil(selectedOption)}
                                onClick={() =>
                                    history.push(
                                        EDIT_VIEW.replace(
                                            ':name',
                                            selectedOption
                                        )
                                    )
                                }
                            >
                                Edit
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => history.push(CREATE_VIEW)}
                            >
                                Create
                            </Button>
                        </SpaceBetween>
                    }
                >
                    Views
                </Header>
            }
        >
            <form onSubmit={e => e.preventDefault()}>
                <Form>
                    <FormField
                        label="Saved Views"
                        description="Choose a previously saved view"
                        secondaryControl={
                            <Button onClick={refetch} iconName="refresh" />
                        }
                    >
                        <Select
                            disabled={isLoading}
                            selectedOption={
                                options.find(i => i.label === selectedOption) ||
                                null
                            }
                            placeholder="Choose a view"
                            onChange={({detail}) => onViewSelected(detail)}
                            options={options}
                            selectedAriaLabel="Selected"
                            statusType={status}
                            loadingText={'Loading views'}
                            errorText={'Unable to load views'}
                        />
                    </FormField>
                </Form>
            </form>
        </Container>
    );
};

ViewSelector.propTypes = {
    selectedOption: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
};
export default ViewSelector;
