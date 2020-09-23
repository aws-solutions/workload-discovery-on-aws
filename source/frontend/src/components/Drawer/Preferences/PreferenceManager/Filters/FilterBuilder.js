export const getFilterMenuTree = (accounts) => {
  try {
    return accounts.map((account, index) => {
      return {
        key: account.accountId,
        label: account.accountId,
        index: index,
        regions: account.regions.map((region, index) => {
          return {
            key: `${account.accountId}-${region.name}`,
            label: region.name,
            index: index,
            filter: {
              accountId: account.accountId,
              region: region.name,
              label: `${account.accountId}-${region.name}`,
            },
          };
        }),

        filter: {
          accountId: account.accountId,
          region: undefined,
          label: account.accountId,
        },
      };
    });
  } catch (e) {
    return [];
  }
};
