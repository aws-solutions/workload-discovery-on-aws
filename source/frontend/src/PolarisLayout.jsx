// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect, useRef, useState} from 'react';
import {matchPath, Outlet, useLocation, useNavigate} from 'react-router';
import {
    AppLayout,
    Box,
    Button,
    Link,
    SideNavigation,
    SpaceBetween,
    Toggle,
} from '@cloudscape-design/components';
import {
    ACCOUNTS,
    COSTS,
    CREATE_DIAGRAM,
    DRAW,
    HOMEPAGE_PATH,
    OPEN_DIAGRAM,
    RESOURCES,
    VIEWS,
} from './routes';
import panels from './help-panel';
import splitPanels from './split-panel';
import {useSplitPanel} from './components/SplitPanel/SplitPanelConfig';
import PlaceholderHelp from './Utils/HelpPanel/PlaceholderHelp';
import {ErrorBoundary} from 'react-error-boundary';
import * as R from 'ramda';
import ErrorFallback from './components/Errors/ErrorFallback';
import {useAuthenticator} from '@aws-amplify/ui-react';
import {useNotificationDispatch} from './components/Contexts/NotificationContext';
import Notifications from './Utils/Notifications';
import {useGetApplicationProblems} from './components/Hooks/useGetApplicationProblems';
import {useResourceState} from './components/Contexts/ResourceContext';
import {useDiagramSettingsState} from './components/Contexts/DiagramSettingsContext';
import {useWebGLState} from './components/Contexts/WebGLContext';

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {user, signOut} = useAuthenticator();
    const {webGLEnabled, toggleWebGL} = useWebGLState();

    const navHeader = {
        text: `Workload Discovery on AWS`,
        href: HOMEPAGE_PATH,
    };

    const navItems = [
        {
            type: 'section',
            text: 'Explore',
            items: [
                {
                    type: 'link',
                    text: 'Resources',
                    href: RESOURCES,
                },
                {
                    type: 'link',
                    text: 'Views',
                    href: VIEWS,
                },
                {
                    type: 'link',
                    text: 'Costs',
                    href: COSTS,
                },
            ],
        },
        {type: 'divider'},
        {
            type: 'section',
            text: 'Diagrams',
            items: [
                {
                    type: 'link',
                    text: 'Manage',
                    href: DRAW,
                },
            ],
        },
        {type: 'divider'},
        {
            type: 'section',
            text: 'Configure',
            items: [
                {
                    type: 'link',
                    text: 'Accounts',
                    href: ACCOUNTS,
                },
            ],
        },
        {type: 'divider'},
        {
            type: 'link',
            text: 'GitHub Repository',
            href: 'https://github.com/aws-solutions/workload-discovery-on-aws',
            external: true,
        },
        {
            type: 'link',
            text: 'Feature request',
            href: 'https://github.com/aws-solutions/workload-discovery-on-aws/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=',
            external: true,
        },
        {
            type: 'link',
            text: 'Raise an issue',
            href: 'https://github.com/aws-solutions/workload-discovery-on-aws/issues/new?assignees=&labels=bug&template=bug_report.md&title=',
            external: true,
        },
        {
            type: 'link',
            text: 'Implementation Guide',
            href: 'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/welcome.html',
            external: true,
        },
        {type: 'divider'},
    ];

    return (
        <>
            <SideNavigation
                items={navItems}
                header={navHeader}
                activeHref={location.pathname}
                onFollow={e => {
                    if (e.detail.external) {
                        window.open(e.detail.href, '_blank', 'rel=noreferrer');
                    } else {
                        e.preventDefault();
                        navigate(e.detail.href);
                    }
                }}
            />
            <Box padding={{left: 'xl'}}>
                <SpaceBetween size={'m'}>
                    <Box>
                        <Toggle
                            checked={webGLEnabled}
                            onChange={({detail}) => toggleWebGL(detail.checked)}
                        >
                            Enable WebGL (Beta)
                        </Toggle>
                    </Box>
                    <Box>
                        Version:{' '}
                        <strong>{window.perspectiveMetadata.version}</strong>
                    </Box>
                    <Box>
                        Logged in as: <strong>{user.username}</strong>
                    </Box>
                    <Box>
                        <Button onClick={signOut} iconName={'external'}>
                            Sign out
                        </Button>
                    </Box>
                </SpaceBetween>
            </Box>
        </>
    );
};

const ToolPanel = () => {
    const location = useLocation();

    return R.pathOr(
        <PlaceholderHelp />,
        ['component'],
        R.find(
            e =>
                matchPath({path: e.path, end: true}, location.pathname),
            panels
        )
    );
};

const SplitPanelLoader = () => {
    const location = useLocation();

    return R.pathOr(
        null,
        ['component'],
        R.find(
            e =>
                matchPath({path: e.path, end: true}, location.pathname),
            splitPanels
        )
    );
};

function isOpenDiagram(pathname) {
    return matchPath({path: OPEN_DIAGRAM, end: true}, pathname) != null;
}

export function PolarisLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const {addNotification, clearAllNotifications} = useNotificationDispatch();
    const {data: appProblems = {}} = useGetApplicationProblems();
    const [navigationOpen, setNavigationOpen] = useState(true);
    const [toolsOpen, setToolsOpen] = useState(false);
    const [, dispatch] = useResourceState();
    const [, dispatchCanvas] = useDiagramSettingsState();
    const pathRef = useRef(location.pathname);

    useEffect(() => {
        const pathname = location.pathname;
        // Skip initial mount — only act on actual navigation, matching
        // the v5 history.listen semantics we migrated away from.
        if (pathRef.current === pathname) return;

        if (pathRef.current === '/') setNavigationOpen(true);

        pathRef.current = pathname;

        if (pathname === CREATE_DIAGRAM || isOpenDiagram(pathname)) return;

        clearAllNotifications({except: ['DeploymentHealthcheckErrors']});
        dispatch({
            type: 'select',
            resources: {},
        });
        dispatch({
            type: 'updateGraphResources',
            graphResources: [],
        });
        dispatchCanvas({
            type: 'setCanvas',
            canvas: null,
        });
        dispatchCanvas({
            type: 'setResources',
            resources: [],
        });
    }, [location.pathname, clearAllNotifications, dispatch, dispatchCanvas]);

    useEffect(() => {
        const logProblems = appProblems?.logProblems ?? [];
        if (!R.isEmpty(logProblems)) {
            addNotification({
                code: 'DeploymentHealthcheckErrors',
                header: 'Deployment Healthcheck Errors Detected',
                content:
                    location.pathname === HOMEPAGE_PATH ? (
                        'There are issues with the Workload Discovery deployment'
                    ) : (
                        <Box>
                            There are issues with the Workload Discovery
                            deployment. Check the errors section on the{' '}
                            <Link
                                href={HOMEPAGE_PATH}
                                onFollow={e => {
                                    e.preventDefault();
                                    navigate(HOMEPAGE_PATH);
                                }}
                            >
                                homepage
                            </Link>{' '}
                            for more information.
                        </Box>
                    ),
                type: 'error',
            });
        }
    }, [appProblems]);

    const {
        splitPanelOpen,
        onSplitPanelToggle,
        splitPanelSize,
        onSplitPanelResize,
        splitPanelPreferences,
        onSplitPanelPreferencesChange,
    } = useSplitPanel(false);

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                navigate('/');
            }}
        >
            <AppLayout
                content={
                    <Box padding={'s'}>
                        <Outlet />
                    </Box>
                }
                disableContentPaddings={true}
                navigation={<Navigation />}
                navigationOpen={navigationOpen}
                toolsOpen={toolsOpen}
                tools={<ToolPanel />}
                notifications={<Notifications maxNotifications={1} />}
                toolsHide={location.pathname === '/'}
                onNavigationChange={e => setNavigationOpen(e.detail.open)}
                onToolsChange={e => setToolsOpen(e.detail.open)}
                splitPanelOpen={splitPanelOpen}
                onSplitPanelToggle={onSplitPanelToggle}
                splitPanelSize={splitPanelSize}
                onSplitPanelResize={onSplitPanelResize}
                splitPanelPreferences={splitPanelPreferences}
                onSplitPanelPreferencesChange={onSplitPanelPreferencesChange}
                splitPanel={<SplitPanelLoader />}
            />
        </ErrorBoundary>
    );
}

export default PolarisLayout;
