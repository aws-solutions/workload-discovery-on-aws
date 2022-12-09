// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import ResourcesSplitPanel from './components/Explore/Resources/Utils/ResourcesSplitPanel';
import React from 'react';
import DrawingSplitPanel from './components/Diagrams/Draw/Utils/DrawingSplitPanel';
import {OPEN_DIAGRAM, RESOURCES, VIEWS} from "./routes";

const splitPanels = [
  {
    title: 'Draw',
    path: OPEN_DIAGRAM,
    component: <DrawingSplitPanel />,
  },
  {
    title: 'Resources',
    path: RESOURCES,
    component: <ResourcesSplitPanel />,
  },
  {
    title: 'Views',
    path: VIEWS,
    component: <ResourcesSplitPanel />,
  },
];

export default splitPanels;
