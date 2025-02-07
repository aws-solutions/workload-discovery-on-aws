// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect} from 'react';
import {saveAs} from 'file-saver';
import {
    Button,
    SpaceBetween,
    Input,
    FormField,
    RadioGroup,
    Modal,
    Select,
    Form,
} from '@cloudscape-design/components';
import validFilename from 'valid-filename';
import {useParams} from 'react-router-dom';
import {exportCSVFromCanvas} from './CSV/CreateCSVExport';
import {exportJSON} from './JSON/CreateJSONExport';
import * as R from 'ramda';
import {useDrawIoUrl} from '../../../../Hooks/useDrawIoUrl';
import {useCreateApplication} from '../../../../Hooks/useMyApplications';
import {regionMap} from '../../../../../Utils/Dictionaries/RegionMap';
import {PSEUDO_RESOURCE_TYPES} from '../../../../../config/constants';

const regionsNoGlobal = R.reject(x => x.id === 'global', regionMap);

const createAccountRegionMap = R.pipe(
    R.filter(x => x.data.type === 'resource'),
    R.map(({data}) => {
        return {
            accountId: data.properties.accountId,
            region: data.properties.awsRegion,
        };
    }),
    R.uniqBy(x => `${x.accountId}|${x.region}`),
    R.groupBy(x => x.accountId),
    Object.entries,
    R.map(([accountId, regions]) => {
        // any account that only has global resources needs to provide an option
        // for the region where the application can be created so we allow the
        // user pick any region
        if(regions.length === 1 && regions[0].region === 'global') {
            return [accountId, regionsNoGlobal.map(x => {
                return {
                    accountId,
                    region: x.id,
                };
            })];
        }
        return [accountId, R.reject(x => x.region === 'global', regions)];
    }),
    Object.fromEntries
);

const ExportDiagramModal = ({
    canvas,
    elements,
    visible,
    onDismiss,
    settings,
}) => {
    const [error, setError] = React.useState(false);
    const {name, visibility} = useParams();
    const [isExportButtonDisabled, setIsExportButtonDisabled] =
        React.useState(true);
    const [accountsObj, setAccountsObj] = React.useState({});
    const [filename, setFilename] = React.useState(name);
    const [applicationName, setApplicationName] = React.useState(
        createDefaultApplicationName(name)
    );
    const [selectedRegion, setSelectedRegion] = React.useState(null);
    const [selectedAccount, setSelectedAccount] = React.useState(null);
    const [exportType, setExportType] = React.useState('drawio');
    const {isLoading: isLoadingCreateApplication, createApplicationAsync} =
        useCreateApplication();

    const {isLoading: loadingDrawIoUrl, refetch} = useDrawIoUrl(
        name,
        visibility,
        {enabled: false}
    );

    const saveFile = (name, blob) => {
        if (validFilename(name)) {
            setError(false);
            saveAs(blob, name);
        } else {
            setError(true);
        }
    };

    const onChangeApplicationName = name => {
        if (name.match(/^[-.\w]+$/)) {
            setError(false);
        } else {
            setError(true);
        }
        setApplicationName(name);
    };

    useEffect(() => {
        const missingValues = {
            drawio: false,
            myapplications:
                applicationName == null ||
                selectedAccount == null ||
                selectedRegion == null,
            csv: filename == null,
            json: filename == null,
            svg: filename == null,
        };
        setIsExportButtonDisabled(
            R.isEmpty(elements.nodes) || missingValues[exportType] || error
        );
    }, [
        elements,
        exportType,
        applicationName,
        selectedAccount,
        selectedRegion,
        error,
        filename,
    ]);

    useEffect(() => {
        if (!R.isEmpty(elements?.nodes ?? [])) {
            const accountsObj = createAccountRegionMap(elements.nodes);
            setAccountsObj(accountsObj);
        }
    }, [elements]);

    function clearApplicationState() {
        setApplicationName(createDefaultApplicationName(name));
        setSelectedAccount(null);
        setSelectedRegion(null);
    }

    const handleExport = async () => {
        const diagramData = settings.hideEdges
            ? R.pick(['nodes'], elements)
            : elements;
        switch (exportType) {
            case 'drawio': {
                const {data: url} = await refetch();
                window.open(url, '_blank', 'rel=noreferrer');
                break;
            }
            case 'csv': {
                exportCSVFromCanvas(diagramData, name);
                break;
            }
            case 'json': {
                saveFile(name, exportJSON(diagramData));
                break;
            }
            case 'myapplications': {
                const resources = diagramData.nodes
                    .filter(
                        x =>
                            x.data.type === 'resource' &&
                            !PSEUDO_RESOURCE_TYPES.has(
                                x.data.properties?.resourceType
                            )
                    )
                    .map(x => {
                        return {
                            id: x.data.id,
                            region: x.data.properties.awsRegion,
                            accountId: x.data.properties.accountId,
                        };
                    })
                    .filter(x => x.id.startsWith('arn:'));

                await createApplicationAsync({
                    name: applicationName,
                    accountId: selectedAccount.value,
                    region: selectedRegion.value,
                    resources,
                }).catch(_ => {}); // this noop is required to prevent unhandled promise errors due to how react-query mutation error handling works
                break;
            }
            case 'svg': {
                saveFile(
                    name,
                    new Blob([canvas.svg({full: true})], {
                        type: 'image/svg+xml',
                    })
                );
                break;
            }
            default: {
                break;
            }
        }
        clearApplicationState();
        onDismiss();
    };

    return (
        <Modal
            onDismiss={onDismiss}
            visible={visible}
            closeAriaLabel="Close export modal"
            header="Export Diagram"
        >
            <SpaceBetween size={'s'}>
                <RadioGroup
                    onChange={({detail}) => setExportType(detail.value)}
                    value={exportType}
                    ariaLabel={
                        'Radio button group used to select which format to export to'
                    }
                    items={[
                        {
                            value: 'json',
                            label: 'JSON',
                            description:
                                'Export a JSON representation of the architecture diagram',
                        },
                        {
                            value: 'csv',
                            label: 'CSV',
                            description:
                                'Export a Comma-separated values representation of the architecture diagram',
                        },
                        {
                            value: 'svg',
                            label: 'SVG',
                            description:
                                'Export the architecture diagram as an SVG file.',
                        },
                        {
                            value: 'drawio',
                            label: 'Diagrams.net (formerly Draw.io)',
                            description:
                                'Export the architecture diagram as a diagrams.net URL with the diagram contents base64 encoded in the URL query string (opens in a new tab).',
                        },
                        {
                            value: 'myapplications',
                            label: 'myApplications',
                            description:
                                'Export the resources in this diagram to myApplications',
                        },
                    ]}
                />
                <form aria-label={'export'} onSubmit={e => e.preventDefault()}>
                    <Form
                        actions={
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button
                                    onClick={() => {
                                        clearApplicationState();
                                        onDismiss();
                                    }}
                                    variant="link"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    data-testid="export-diagram-modal-button"
                                    variant="primary"
                                    loading={
                                        (exportType === 'drawio' &&
                                            loadingDrawIoUrl) ||
                                        (exportType === 'myapplications' &&
                                            isLoadingCreateApplication)
                                    }
                                    iconName={(() => {
                                        switch (exportType) {
                                            case 'myapplications':
                                                return null;
                                            case 'drawio':
                                                return 'external';
                                            default:
                                                return 'download';
                                        }
                                    })()}
                                    onClick={handleExport}
                                    disabled={isExportButtonDisabled}
                                >
                                    Export
                                </Button>
                            </SpaceBetween>
                        }
                    >
                        <SpaceBetween direction="vertical" size="l">
                            {!['drawio', 'myapplications'].includes(
                                exportType
                            ) && (
                                <FormField
                                    label="File name"
                                    errorText={
                                        error
                                            ? 'Please enter a valid file name'
                                            : null
                                    }
                                    description="Provide a name for the export"
                                >
                                    <Input
                                        value={filename}
                                        invalid={error}
                                        onChange={({detail}) =>
                                            setFilename(detail.value)
                                        }
                                    />
                                </FormField>
                            )}
                            {exportType === 'myapplications' && (
                                <>
                                    <FormField
                                        ariaRequired
                                        label="Application name"
                                        constraintText="Maximum 150 alphanumeric characters including dashes, periods, and underscores"
                                        errorText={
                                            error
                                                ? 'Please enter a valid application name'
                                                : null
                                        }
                                        description="Provide a name for the application"
                                    >
                                        <Input
                                            value={applicationName}
                                            invalid={error}
                                            onChange={({detail}) =>
                                                onChangeApplicationName(
                                                    detail.value
                                                )
                                            }
                                        />
                                    </FormField>
                                    <FormField
                                        ariaRequired
                                        label="Account"
                                        description="Select the account in which to create the application"
                                    >
                                        <Select
                                            selectedOption={selectedAccount}
                                            onChange={({detail}) =>
                                                setSelectedAccount(
                                                    detail.selectedOption
                                                )
                                            }
                                            options={Object.keys(
                                                accountsObj
                                            ).map(accountId => {
                                                return {
                                                    value: accountId,
                                                    label: accountId,
                                                };
                                            })}
                                        />
                                    </FormField>
                                    <FormField
                                        ariaRequired
                                        label="Region"
                                        description="Select the region in which to create the application"
                                    >
                                        <Select
                                            disabled={selectedAccount == null}
                                            selectedOption={selectedRegion}
                                            onChange={({detail}) =>
                                                setSelectedRegion(
                                                    detail.selectedOption
                                                )
                                            }
                                            options={(
                                                accountsObj[
                                                    selectedAccount?.value
                                                ] ?? []
                                            ).map(({region}) => {
                                                return {
                                                    value: region,
                                                    label: region,
                                                };
                                            })}
                                        />
                                    </FormField>
                                </>
                            )}
                        </SpaceBetween>
                    </Form>
                </form>
            </SpaceBetween>
        </Modal>
    );
};

// createDefaultApplicationName returns a string that is a valid application name
const createDefaultApplicationName = name => name.replace(/ /g, '-');

export default ExportDiagramModal;
