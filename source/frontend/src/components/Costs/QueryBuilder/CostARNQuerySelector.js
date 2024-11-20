// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useMemo} from 'react';
import {Header, Container, Input} from '@cloudscape-design/components';

import PropTypes from 'prop-types';
import AttributeCreator from '../../../Utils/Forms/AttributeCreator';

const Control = React.memo(({value, index, placeholder, setItems, prop}) => {
    return (
        <Input
            value={value}
            placeholder={placeholder}
            onChange={({detail}) => {
                setItems(items => {
                    const updatedItems = [...items];
                    updatedItems[index] = {
                        ...updatedItems[index],
                        [prop]: detail.value,
                    };
                    return updatedItems;
                });
            }}
        />
    );
});

Control.displayName = 'Control';

function controlCell(resourceArn, itemIndex, setARNs) {
    return (
        <Control
            prop="resourceArn"
            value={resourceArn}
            index={itemIndex}
            placeholder={'Enter an Resource Id or ARN'}
            setItems={setARNs}
        />
    );
}

const CostARNQuerySelector = ({arns, setARNs}) => {
    const definition = useMemo(
        () => [
            {
                label: 'Resource',
                control: ({resourceArn = ''}, itemIndex) =>
                    controlCell(resourceArn, itemIndex, setARNs),
            },
        ],
        [setARNs]
    );

    return (
        <Container
            header={
                <Header
                    variant="h2"
                    description="Specify the AWS resources to query"
                >
                    AWS Resources
                </Header>
            }
        >
            <AttributeCreator
                item="Resource ID or ARN"
                items={arns}
                label="Amazon Resource Name (ARN) or Resource Id"
                placeholder="Enter a resource Id or ARN"
                itemAdded={() => setARNs([...arns, {}])}
                itemRemoved={itemIndex => {
                    const tmpItems = [...arns];
                    tmpItems.splice(itemIndex, 1);
                    setARNs(tmpItems);
                }}
                setItems={setARNs}
                definition={definition}
            />
        </Container>
    );
};

CostARNQuerySelector.propTypes = {
    arns: PropTypes.array.isRequired,
    setARNs: PropTypes.func.isRequired,
};

export default CostARNQuerySelector;
