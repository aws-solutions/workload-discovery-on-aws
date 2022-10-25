import { CsvBuilder } from 'filefy';
import * as R  from 'ramda';

const columns = [
  {
    header: 'type',
  },
  {
    header: 'name',
  },
  {
    header: 'accountId',
  },
  {
    header: 'region',
  },
  {
    header: 'estimatedCost',
  },
];

function createExportRow(type, name, accountId, region, cost) {
  return { type, name, accountId, region, cost };
}

const getExportRows = (resources) => {
  return resources.map((e) =>
    createExportRow(
      e.data.resource.type,
      e.data.title,
      e.data.resource.accountId,
      e.data.resource.region,
      e.data.cost
    )
  );
};


export const exportCSVFromCanvas = (elements, name) => {
  const resources = elements
    .nodes
    .filter((item) => !item.edge && R.equals(item.data?.type, 'resource'));
  new CsvBuilder(`${name}.csv`)
    .setDelimeter(';')
    .setColumns(R.map((e) => e.header, columns))
    .addRows(R.map((e) => Object.values(e), getExportRows(resources)))
    .exportFile();
};


export const exportCSVFromTable = (nodes, name) => {

  new CsvBuilder(`${name}.csv`)
    .setDelimeter(';')
    .setColumns(R.map((e) => e.header, columns))
    .addRows(R.map((e) => Object.values(e), getExportRows(nodes)))
    .exportFile();
};
