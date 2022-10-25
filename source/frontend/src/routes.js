import Homepage from './components/Homepage/Homepage';
import DiscoverableAccountsPage from './components/RegionManagement/DiscoverableRegions/DiscoverableAccountsPage';
import ImportContent from './components/RegionManagement/SinglePageImport/ImportContent';
import ViewExplorerPage from './components/Explore/Views/ViewExplorerPage';
import ViewFormPage from './components/Explore/Views/ViewForm/ViewFormPage';
import ResourcesPage from './components/Explore/Resources/ResourcesPage';
import CostsPage from './components/Costs/QueryBuilder/CostsPage';
import DiagramExplorer from './components/Diagrams/Management/DiagramExplorer';
import DrawDiagramPage from './components/Diagrams/Draw/DrawDiagram/DrawDiagramPage';
import OpenDiagramPage from './components/Diagrams/Draw/DrawDiagram/OpenDiagram/OpenDiagramPage';
import CreateDiagramPage from './components/Diagrams/Draw/DrawDiagram/CreateDiagram/CreateDiagramPage';
import CostOverview from './components/Costs/Report/CostOverview';
import ExportDiagram from './components/Diagrams/Draw/Canvas/Export/ExportDiagram';

export const HOMEPAGE_PATH = '/';
export const RESOURCES = '/resources';
export const ACCOUNTS = '/accounts';
export const IMPORT = '/import';
export const VIEWS = '/views';
export const VIEW = '/views/:name';
export const CREATE_VIEW = '/views/create';
export const EDIT_VIEW = '/views/:name/edit';
export const DRAW = '/diagrams';
export const CREATE_DIAGRAM = '/diagrams/create';
export const COSTS = '/costs';
export const DIAGRAM_MANAGEMENT = '/diagrams';
export const OPEN_DIAGRAM = '/diagrams/:visibility/:name';
export const COST_REPORT = '/diagrams/:visibility/:name/cost_report';
export const EXPORT = '/diagrams/:visibility/:name/export'

const routes = [
  {
    title: 'Workload Discovery on AWS',
    path: HOMEPAGE_PATH,
    exact: true,
    component: Homepage,
  },
  {
    title: 'Accounts',
    path: ACCOUNTS,
    exact: true,
    component: DiscoverableAccountsPage,
  },
  {
    title: 'Import',
    path: IMPORT,
    exact: true,
    component: ImportContent,
  },
  {
    title: 'Edit view',
    path: EDIT_VIEW,
    exact: true,
    component: ViewFormPage,
  },
  {
    title: 'Create view',
    path: CREATE_VIEW,
    exact: true,
    component: ViewFormPage,
  },
  {
    title: 'Views',
    path: [VIEWS, VIEW],
    exact: true,
    component: ViewExplorerPage,
  },
  {
    title: 'Draw',
    path: DRAW,
    exact: true,
    component: DrawDiagramPage,
  },
  {
    title: 'Open diagram',
    path: OPEN_DIAGRAM,
    exact: true,
    component: OpenDiagramPage,
  },
  {
    title: 'Create diagram',
    path: CREATE_DIAGRAM,
    exact: true,
    component: CreateDiagramPage,
  },
  {
    title: 'Resources',
    path: RESOURCES,
    exact: true,
    component: ResourcesPage,
  },
  {
    title: 'Costs',
    path: COSTS,
    exact: true,
    component: CostsPage,
  },
  {
    title: 'Cost report',
    path: COST_REPORT,
    exact: true,
    component: CostOverview,
  },
  {
    title: 'Manage diagrams',
    path: DIAGRAM_MANAGEMENT,
    exact: true,
    component: DiagramExplorer,
  },
  {
    title: 'Export diagram',
    path: EXPORT,
    exact: true,
    component: ExportDiagram,
  },
];

export default routes;