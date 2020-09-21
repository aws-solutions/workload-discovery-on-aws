const regions = [
  'us-east-2',
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'ap-east-1',
  'ap-south-1',
  'ap-northeast-2',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ca-central-1',
  'cn-north-1',
  'cn-northwest-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-north-1',
  'sa-east-1',
  'us-gov-east-1',
  'us-gov-west-1'
];

const getSelectedAccountRegions = (importConfig, accountId) => {
  if (importConfig) {
    const account = importConfig.importAccounts
      .map(account => account.accountId)
      .indexOf(accountId);     
    return account >= 0 ? importConfig.importAccounts[account].regions : [];
  } else {
    return [];
  }
};

export const getRegions = selectedRegions => {
  return regions
    .filter(region => !selectedRegions.includes(region))
    .map(item => buildSelectItem(item));
};

export const getFilteredRegions = (importConfig, accountId) => {
  return regions
    .filter(
      region =>
        !getSelectedAccountRegions(importConfig, accountId).includes(region)
    )
    .map(item => buildSelectItem(item));
};

export const filterRegions = (importedRegions) => {
  const newRegions = regions.filter(region => !importedRegions.includes(region)).map(region => buildSelectItem(region))
  return newRegions
}

const buildSelectItem = item => {
  let selectItem = {
    value: item,
    label: item,
    id: item,
    group: item
  };

  return selectItem;
};
