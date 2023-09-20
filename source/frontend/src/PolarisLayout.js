// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import PropTypes from "prop-types";
import {matchPath, Route, Switch, useHistory, useLocation,} from 'react-router-dom';
import {AppLayout, Box, Button, SideNavigation, SpaceBetween} from '@cloudscape-design/components';
import routes, {ACCOUNTS, COSTS, CREATE_DIAGRAM, DRAW, HOMEPAGE_PATH, OPEN_DIAGRAM, RESOURCES, VIEWS,} from './routes';
import panels from './help-panel';
import splitPanels from './split-panel';
import {useSplitPanel} from './components/SplitPanel/SplitPanelConfig';
import PlaceholderHelp from './Utils/HelpPanel/PlaceholderHelp';
import {ErrorBoundary} from 'react-error-boundary'
import * as R from "ramda";
import ErrorFallback from "./components/Errors/ErrorFallback";
import {useAuthenticator} from '@aws-amplify/ui-react';
import {useFirstMountState, useLocalStorage} from 'react-use';
import {useNotificationDispatch} from "./components/Contexts/NotificationContext";
import Notifications from "./Utils/Notifications";
import {useResourceState} from "./components/Contexts/ResourceContext";
import {useDiagramSettingsState} from "./components/Contexts/DiagramSettingsContext";

const Navigation = ({ onNavigate }) => {
  const history = useHistory();
  const location = useLocation();
  const { user, signOut } = useAuthenticator();
  history.listen(onNavigate);

  useLayoutEffect(() => {
    onNavigate(location);
  });

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
    { type: 'divider' },
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
    { type: 'divider' },
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
    { type: 'divider' },
    {
      type: 'link',
      text: 'Feature request',
      href:
        'https://github.com/awslabs/aws-perspective/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=',
      external: true,
    },
    {
      type: 'link',
      text: 'Raise an issue',
      href: 'https://github.com/awslabs/aws-perspective/issues/new?assignees=&labels=bug&template=bug_report.md&title=',
      external: true,
    },
    { type: 'divider' },
  ];

  return (
    <>
      <SideNavigation
        items={navItems}
        header={navHeader}
        activeHref={location.pathname}
        onFollow={(e) => {
          if (e.detail.external) {
            window.open(e.detail.href, '_blank', 'rel=noreferrer');
          } else {
            e.preventDefault();
            history.push(e.detail.href);
          }
        }}
      />
      <Box padding={{left: "xl"}}>
        <SpaceBetween size={"m"}>
          <Box>
            Version: <strong>{window.perspectiveMetadata.version}</strong>
          </Box>
          <Box>
            Logged in as: <strong>{user.username}</strong>
          </Box>
          <Box>
            <Button onClick={signOut} iconName={"external"}>Sign out</Button>
          </Box>
        </SpaceBetween>
      </Box>
    </>
  );
};

Navigation.propTypes = {
  onNavigate: PropTypes.func.isRequired
}

const ToolPanel = ({ onNavigate }) => {
  const history = useHistory();
  const location = useLocation();
  history.listen(onNavigate);

  useLayoutEffect(() => {
    onNavigate(location);
  });

  return R.pathOr(
    <PlaceholderHelp />,
    ['component'],
    R.find((e) => matchPath(location.pathname, {
      path: e.path,
      exact: true
    }), panels)
  );
};

ToolPanel.propTypes = {
  onNavigate: PropTypes.func.isRequired
}

const SplitPanelLoader = ({ onNavigate }) => {
  const history = useHistory();
  const location = useLocation();
  history.listen(onNavigate);

  useLayoutEffect(() => {
    onNavigate(location);
  });
  return R.pathOr(
    null,
    ['component'],
    R.find((e) => matchPath(location.pathname, {
        path: e.path,
        exact: true
      }), splitPanels)
  );
};

SplitPanelLoader.propTypes = {
  onNavigate: PropTypes.func.isRequired
}

const Pages = (props) => (
  <div id='content-root'>
    <Switch>
      {routes.map(({ component: Component, ...rest }) => (
        <Route {...rest} key={rest.title}>
          <Component {...props} />
        </Route>
      ))}
    </Switch>
  </div>
);

export function PolarisLayout() {
  const history = useHistory();
  const location = useLocation();
  const isFirstMount = useFirstMountState();
  const { clearAllNotifications } = useNotificationDispatch()
  const [isFirstVisit, setIsFirstVisit] = useLocalStorage('firstVisit', true);
  const [navigationOpen, setNavigationOpen] = useState(location.pathname !== '/');
  const [toolsOpen, setToolsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState();
  const [schema, setSchema] = useState();
  const [, dispatch] = useResourceState();
  const [, dispatchCanvas] = useDiagramSettingsState()
  const pathRef = useRef(location.pathname);

  useEffect(() => {
    // always open nav if we're moving from the homepage
    return history.listen(({pathname}) => {
      if (pathRef.current === "/") setNavigationOpen(true);
      pathRef.current = pathname;
      if (pathname !== CREATE_DIAGRAM || !(pathRef.current === CREATE_DIAGRAM && pathname === OPEN_DIAGRAM)) {
        clearAllNotifications()
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
      }
    });
  }, [clearAllNotifications, dispatch, dispatchCanvas, history]);

  useEffect(() => {
    if (isFirstVisit) {
      setIsFirstVisit(false);
    } else if (location.pathname === '/' && isFirstMount) {
      history.push(RESOURCES);
    }
  }, [history, isFirstMount, isFirstVisit, location.pathname, setIsFirstVisit]);

  const {
    splitPanelOpen,
    onSplitPanelToggle,
    splitPanelSize,
    onSplitPanelResize,
    splitPanelPreferences,
    onSplitPanelPreferencesChange,
  } = useSplitPanel(false);

  const handleNavigation = (e) => {
    if (e.pathname !== location.pathname)
      setCurrentPath(e.pathname)
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        history.push("/");
      }}
    >
      <AppLayout
        content={<Pages schema={schema} setSchema={setSchema} />}
        disableContentPaddings={currentPath === "/"}
        navigation={
          <Navigation
            onNavigate={handleNavigation}
            activeHref='/'
          />
        }
        navigationOpen={navigationOpen}
        toolsOpen={toolsOpen}
        tools={
          <ToolPanel
            onNavigate={handleNavigation}
            activeHref='/'
          />
        }
        notifications={<Notifications maxNotifications={1}/>}
        toolsHide={location.pathname === "/"}
        onNavigationChange={(e) => setNavigationOpen(e.detail.open)}
        onToolsChange={(e) => setToolsOpen(e.detail.open)}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={onSplitPanelToggle}
        splitPanelSize={splitPanelSize}
        onSplitPanelResize={onSplitPanelResize}
        splitPanelPreferences={splitPanelPreferences}
        onSplitPanelPreferencesChange={onSplitPanelPreferencesChange}
        splitPanel={
          <SplitPanelLoader
            onNavigate={(e) => setCurrentPath(e.pathname)}
            activeHref='/'
          />
        }
      />
    </ErrorBoundary>
  );
}

export default PolarisLayout;
