import ResourcesHelper from './components/Explore/Resources/Utils/ResourcesHelper';
import ImportRegionHelper from './components/RegionManagement/SinglePageImport/ImportRegionHelper';
import React from 'react';
import ViewFormHelper from './components/Explore/Views/ViewForm/ViewFormHelper';
import ViewExplorerHelper from './components/Explore/Views/ViewExplorerHelper';
import DiscoverableAccountsAndRegionsHelper from './components/RegionManagement/DiscoverableRegions/DiscoverableAccountsAndRegionsHelper';
import OpenDiagramHelper from './components/Diagrams/Draw/DrawDiagram/OpenDiagram/OpenDiagramHelper';
import CreateDiagramHelper from './components/Diagrams/Draw/DrawDiagram/CreateDiagram/CreateDiagramHelper';
import {
  ACCOUNTS, COST_REPORT, COSTS,
  CREATE_DIAGRAM,
  CREATE_VIEW,
  DIAGRAM_MANAGEMENT,
  EDIT_VIEW,
  IMPORT,
  OPEN_DIAGRAM,
  RESOURCES,
  VIEW,
  VIEWS
} from "./routes";
import DiagramExplorerHelper from "./components/Diagrams/Management/DiagramExplorerHelper";
import CostReportHelper from "./components/Costs/Report/CostReportHelper";
import CostExplorerHelper from "./components/Costs/QueryBuilder/CostExplorerHelper";
const panels = [
  {
    title: 'Resources',
    path: RESOURCES,
    component: <ResourcesHelper />,
  },
  {
    title: 'Edit a View',
    path: EDIT_VIEW,
    component: <ViewFormHelper />,
  },
  {
    title: 'Create a View',
    path: CREATE_VIEW,
    component: <ViewFormHelper />,
  },
  {
    title: 'Explore Views',
    path: VIEWS,
    component: <ViewExplorerHelper />,
  },
  {
    title: 'Explore View',
    path: VIEW,
    component: <ViewExplorerHelper />,
  },
  {
    title: 'Import',
    path: IMPORT,
    component: <ImportRegionHelper />,
  },
  {
    title: 'Accounts',
    path: ACCOUNTS,
    component: <DiscoverableAccountsAndRegionsHelper />,
  },
  {
    title: 'Draw Diagram',
    path: OPEN_DIAGRAM,
    component: <OpenDiagramHelper />,
  },
  {
    title: 'Create Diagram',
    path: CREATE_DIAGRAM,
    component: <CreateDiagramHelper />,
  },
  {
    title: 'Diagram Management',
    path: DIAGRAM_MANAGEMENT,
    component: <DiagramExplorerHelper />,
  },
  {
    title: 'Cost Report',
    path: COST_REPORT,
    component: <CostReportHelper />,
  },
  {
    title: 'Cost Explorer',
    path: COSTS,
    component: <CostExplorerHelper />,
  },
];

export default panels;
