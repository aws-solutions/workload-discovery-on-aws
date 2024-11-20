// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useCallback, useEffect} from 'react';
import {
    Container,
    ExpandableSection,
    Header,
    SpaceBetween,
} from '@cloudscape-design/components';
import Breadcrumbs from '../../../../../Utils/Breadcrumbs';
import {DRAW, OPEN_DIAGRAM} from '../../../../../routes';
import {useParams} from 'react-router-dom';
import ResourceSearch from '../../Utils/ResourceSearch';
import DiagramControlPanel from '../DiagramControlsPanel';
import PureCytoscape from '../../Canvas/PureCytoscape';
import {useDiagramSettingsState} from '../../../../Contexts/DiagramSettingsContext';
import {
    addResources,
    removeResource,
} from '../../Canvas/Commands/CanvasCommands';
import {getStandardLayout} from '../../Canvas/Layout/StandardGraphLayout';
import DiagramSettings from '../../Utils/DiagramSettings';
import {useObject} from '../../../../Hooks/useS3Objects';
import * as R from 'ramda';
import {DEFAULT_COSTS_INTERVAL} from '../../../../../config/constants';

const DIAGRAMS = 'diagrams/';

const OpenDiagramPage = () => {
    const [{canvas, resources}, dispatchCanvas] = useDiagramSettingsState();
    const [settings, setSettings] = React.useState(null);
    const {name, visibility} = useParams();
    const {data} = useObject(name, DIAGRAMS, visibility);

    const updateCanvas = useCallback(
        newCanvas => {
            dispatchCanvas({
                type: 'setCanvas',
                canvas: newCanvas,
            });
        },
        [dispatchCanvas]
    );

    const updateResources = useCallback(() => {
        dispatchCanvas({
            type: 'setResources',
            resources: canvas.nodes(),
        });
    }, [canvas, dispatchCanvas]);

    useEffect(() => {
        if (canvas && settings) {
            const resources = canvas
                .nodes()
                .filter(e => e?.data('type') === 'resource');
            const props = {
                accounts: 'accountId',
                regions: 'awsRegion',
                resourceTypes: 'resourceType',
            };
            const relevantProps = Object.keys(props).filter(
                prop => settings[prop] && settings[prop].length > 0
            );
            const inSettingsArray = r =>
                relevantProps.every(prop => {
                    return (settings[prop] ?? []).includes(
                        r.data('properties')[props[prop]]
                    );
                });
            const toRemove =
                (settings?.hideSelected ?? true)
                    ? resources.filter(
                          r => r.data('properties') && inSettingsArray(r)
                      )
                    : resources.filter(
                          r => r.data('properties') && !inSettingsArray(r)
                      );

            if (toRemove.length > 0 && relevantProps.length > 0) {
                removeResource(
                    canvas,
                    updateCanvas,
                    updateResources,
                    toRemove.map(i => i.id())
                );
            }
            canvas
                .edges()
                .style(
                    'visibility',
                    (settings?.hideEdges ?? false) ? 'hidden' : 'visible'
                );
        }
    }, [canvas, resources, settings, updateCanvas, updateResources]);

    useEffect(() => {
        if (data && canvas && !canvas.destroyed()) {
            if (data.settings) {
                setSettings({
                    ...data.settings,
                    // create fallback for older diagrams as default value used to be null
                    costInterval:
                        data.settings.costInterval ?? DEFAULT_COSTS_INTERVAL,
                });
            } else {
                setSettings({
                    costInterval: DEFAULT_COSTS_INTERVAL,
                    accounts: [],
                    regions: [],
                    resourceTypes: [],
                    hideSelected: true,
                    hideEdges: false,
                });
            }

            addResources(
                canvas,
                updateCanvas,
                updateResources,
                R.pick(['nodes', 'edges'], data),
                getStandardLayout
            );
        }
    }, [canvas, data, updateCanvas, updateResources]);

    return (
        <SpaceBetween size="l">
            <Breadcrumbs
                items={[
                    {text: 'Diagrams', href: DRAW},
                    {text: name, href: OPEN_DIAGRAM},
                ]}
            />
            <Container
                header={
                    <Header
                        variant="h2"
                        actions={<DiagramControlPanel settings={settings} />}
                    >
                        {name}
                    </Header>
                }
            >
                <SpaceBetween size={'l'}>
                    <ResourceSearch />
                    <PureCytoscape name={name} visibility={visibility} />
                    {settings && (
                        <ExpandableSection header={'Diagram Settings'}>
                            <DiagramSettings
                                initialSettings={settings}
                                onSettingsChange={setSettings}
                            />
                        </ExpandableSection>
                    )}
                </SpaceBetween>
            </Container>
        </SpaceBetween>
    );
};

export default OpenDiagramPage;
