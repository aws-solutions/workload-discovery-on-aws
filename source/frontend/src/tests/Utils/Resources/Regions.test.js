import {
  getRegions,
  getFilteredRegions
} from '../../../Utils/Resources/Regions';

const allRegions = [
  {
    value: 'us-east-2',
    label: 'us-east-2',
    id: 'us-east-2',
    group: 'us-east-2'
  },
  {
    value: 'us-east-1',
    label: 'us-east-1',
    id: 'us-east-1',
    group: 'us-east-1'
  },
  {
    value: 'us-west-1',
    label: 'us-west-1',
    id: 'us-west-1',
    group: 'us-west-1'
  },
  {
    value: 'us-west-2',
    label: 'us-west-2',
    id: 'us-west-2',
    group: 'us-west-2'
  },
  {
    value: 'ap-east-1',
    label: 'ap-east-1',
    id: 'ap-east-1',
    group: 'ap-east-1'
  },
  {
    value: 'ap-south-1',
    label: 'ap-south-1',
    id: 'ap-south-1',
    group: 'ap-south-1'
  },
  {
    value: 'ap-northeast-2',
    label: 'ap-northeast-2',
    id: 'ap-northeast-2',
    group: 'ap-northeast-2'
  },
  {
    value: 'ap-southeast-1',
    label: 'ap-southeast-1',
    id: 'ap-southeast-1',
    group: 'ap-southeast-1'
  },
  {
    value: 'ap-southeast-2',
    label: 'ap-southeast-2',
    id: 'ap-southeast-2',
    group: 'ap-southeast-2'
  },
  {
    value: 'ap-northeast-1',
    label: 'ap-northeast-1',
    id: 'ap-northeast-1',
    group: 'ap-northeast-1'
  },
  {
    value: 'ca-central-1',
    label: 'ca-central-1',
    id: 'ca-central-1',
    group: 'ca-central-1'
  },
  {
    value: 'cn-north-1',
    label: 'cn-north-1',
    id: 'cn-north-1',
    group: 'cn-north-1'
  },
  {
    value: 'cn-northwest-1',
    label: 'cn-northwest-1',
    id: 'cn-northwest-1',
    group: 'cn-northwest-1'
  },
  {
    value: 'eu-central-1',
    label: 'eu-central-1',
    id: 'eu-central-1',
    group: 'eu-central-1'
  },
  {
    value: 'eu-west-1',
    label: 'eu-west-1',
    id: 'eu-west-1',
    group: 'eu-west-1'
  },
  {
    value: 'eu-west-2',
    label: 'eu-west-2',
    id: 'eu-west-2',
    group: 'eu-west-2'
  },
  {
    value: 'eu-west-3',
    label: 'eu-west-3',
    id: 'eu-west-3',
    group: 'eu-west-3'
  },
  {
    value: 'eu-north-1',
    label: 'eu-north-1',
    id: 'eu-north-1',
    group: 'eu-north-1'
  },
  {
    value: 'sa-east-1',
    label: 'sa-east-1',
    id: 'sa-east-1',
    group: 'sa-east-1'
  },
  {
    value: 'us-gov-east-1',
    label: 'us-gov-east-1',
    id: 'us-gov-east-1',
    group: 'us-gov-east-1'
  },
  {
    value: 'us-gov-west-1',
    label: 'us-gov-west-1',
    id: 'us-gov-west-1',
    group: 'us-gov-west-1'
  }
];

const allRegionsWithoutEUWest1 = [
  {
    value: 'us-east-2',
    label: 'us-east-2',
    id: 'us-east-2',
    group: 'us-east-2'
  },
  {
    value: 'us-east-1',
    label: 'us-east-1',
    id: 'us-east-1',
    group: 'us-east-1'
  },
  {
    value: 'us-west-1',
    label: 'us-west-1',
    id: 'us-west-1',
    group: 'us-west-1'
  },
  {
    value: 'us-west-2',
    label: 'us-west-2',
    id: 'us-west-2',
    group: 'us-west-2'
  },
  {
    value: 'ap-east-1',
    label: 'ap-east-1',
    id: 'ap-east-1',
    group: 'ap-east-1'
  },
  {
    value: 'ap-south-1',
    label: 'ap-south-1',
    id: 'ap-south-1',
    group: 'ap-south-1'
  },
  {
    value: 'ap-northeast-2',
    label: 'ap-northeast-2',
    id: 'ap-northeast-2',
    group: 'ap-northeast-2'
  },
  {
    value: 'ap-southeast-1',
    label: 'ap-southeast-1',
    id: 'ap-southeast-1',
    group: 'ap-southeast-1'
  },
  {
    value: 'ap-southeast-2',
    label: 'ap-southeast-2',
    id: 'ap-southeast-2',
    group: 'ap-southeast-2'
  },
  {
    value: 'ap-northeast-1',
    label: 'ap-northeast-1',
    id: 'ap-northeast-1',
    group: 'ap-northeast-1'
  },
  {
    value: 'ca-central-1',
    label: 'ca-central-1',
    id: 'ca-central-1',
    group: 'ca-central-1'
  },
  {
    value: 'cn-north-1',
    label: 'cn-north-1',
    id: 'cn-north-1',
    group: 'cn-north-1'
  },
  {
    value: 'cn-northwest-1',
    label: 'cn-northwest-1',
    id: 'cn-northwest-1',
    group: 'cn-northwest-1'
  },
  {
    value: 'eu-central-1',
    label: 'eu-central-1',
    id: 'eu-central-1',
    group: 'eu-central-1'
  },
  {
    value: 'eu-west-2',
    label: 'eu-west-2',
    id: 'eu-west-2',
    group: 'eu-west-2'
  },
  {
    value: 'eu-west-3',
    label: 'eu-west-3',
    id: 'eu-west-3',
    group: 'eu-west-3'
  },
  {
    value: 'eu-north-1',
    label: 'eu-north-1',
    id: 'eu-north-1',
    group: 'eu-north-1'
  },
  {
    value: 'sa-east-1',
    label: 'sa-east-1',
    id: 'sa-east-1',
    group: 'sa-east-1'
  },
  {
    value: 'us-gov-east-1',
    label: 'us-gov-east-1',
    id: 'us-gov-east-1',
    group: 'us-gov-east-1'
  },
  {
    value: 'us-gov-west-1',
    label: 'us-gov-west-1',
    id: 'us-gov-west-1',
    group: 'us-gov-west-1'
  }
];

const allRegionsWithImportConfig = [
  {
    value: 'us-west-1',
    label: 'us-west-1',
    id: 'us-west-1',
    group: 'us-west-1'
  },
  {
    value: 'us-west-2',
    label: 'us-west-2',
    id: 'us-west-2',
    group: 'us-west-2'
  },
  {
    value: 'ap-east-1',
    label: 'ap-east-1',
    id: 'ap-east-1',
    group: 'ap-east-1'
  },
  {
    value: 'ap-south-1',
    label: 'ap-south-1',
    id: 'ap-south-1',
    group: 'ap-south-1'
  },
  {
    value: 'ap-northeast-2',
    label: 'ap-northeast-2',
    id: 'ap-northeast-2',
    group: 'ap-northeast-2'
  },
  {
    value: 'ap-southeast-1',
    label: 'ap-southeast-1',
    id: 'ap-southeast-1',
    group: 'ap-southeast-1'
  },
  {
    value: 'ap-southeast-2',
    label: 'ap-southeast-2',
    id: 'ap-southeast-2',
    group: 'ap-southeast-2'
  },
  {
    value: 'ap-northeast-1',
    label: 'ap-northeast-1',
    id: 'ap-northeast-1',
    group: 'ap-northeast-1'
  },
  {
    value: 'ca-central-1',
    label: 'ca-central-1',
    id: 'ca-central-1',
    group: 'ca-central-1'
  },
  {
    value: 'cn-north-1',
    label: 'cn-north-1',
    id: 'cn-north-1',
    group: 'cn-north-1'
  },
  {
    value: 'cn-northwest-1',
    label: 'cn-northwest-1',
    id: 'cn-northwest-1',
    group: 'cn-northwest-1'
  },
  {
    value: 'eu-central-1',
    label: 'eu-central-1',
    id: 'eu-central-1',
    group: 'eu-central-1'
  },
  {
    value: 'eu-west-2',
    label: 'eu-west-2',
    id: 'eu-west-2',
    group: 'eu-west-2'
  },
  {
    value: 'eu-west-3',
    label: 'eu-west-3',
    id: 'eu-west-3',
    group: 'eu-west-3'
  },
  {
    value: 'eu-north-1',
    label: 'eu-north-1',
    id: 'eu-north-1',
    group: 'eu-north-1'
  },
  {
    value: 'sa-east-1',
    label: 'sa-east-1',
    id: 'sa-east-1',
    group: 'sa-east-1'
  },
  {
    value: 'us-gov-east-1',
    label: 'us-gov-east-1',
    id: 'us-gov-east-1',
    group: 'us-gov-east-1'
  },
  {
    value: 'us-gov-west-1',
    label: 'us-gov-west-1',
    id: 'us-gov-west-1',
    group: 'us-gov-west-1'
  }
];

const importConfig = {
  accountId: 'XXXXXXXXXXXX',
  profile: 'perspective',
  role: 'arn:aws:iam::account:role/someRole',
  zoomRegion: 'eu-west-1',
  configAggregator: 'aws-some-aggregator',
  apiURL: 'https://some.api',
  dataPath: 'resources',
  searchPath: 'search',
  zoomDataBucket: 'some-bucket',
  importAccounts: [
    {
      accountId: 'XXXXXXXXXXXX',
      regions: ['us-east-1', 'us-east-2', 'eu-west-1']
    }
  ],
  selectedRegions: ['us-east-1'],
  accountID: 'XXXXXXXXXXXX'
};

test('get all regions with none already selected', () => {
  const regions = getRegions([]);
  expect(regions).toEqual(allRegions);
});

test('get all regions with eu-west-1 already selected', () => {
  const regions = getRegions(['eu-west-1']);
  expect(regions).toEqual(allRegionsWithoutEUWest1);
});

test('get filtered regions with importConfig containing single account with multiple regions already imported', () => {
  const regions = getFilteredRegions(importConfig, 'XXXXXXXXXXXX');
  expect(regions).toEqual(allRegionsWithImportConfig);
});

test('get filtered regions with undefined importConfig. It should bring back every region', () => {
  const regions = getFilteredRegions(undefined, 'XXXXXXXXXXXX');
  expect(regions).toEqual(allRegions);
});

test('get filtered regions with an account id that does not exist in importConfig. It should bring back every region', () => {
  const regions = getFilteredRegions(importConfig, 'XXXXXXXXXXXXY');
  expect(regions).toEqual(allRegions);
});
