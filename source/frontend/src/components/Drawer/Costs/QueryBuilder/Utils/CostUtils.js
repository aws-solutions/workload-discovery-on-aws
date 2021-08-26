const R = require('ramda');
export const getRegions = (selectedRegions, selectedAccounts, accounts) => {
  return R.isEmpty(selectedRegions)
    ? R.isEmpty(selectedAccounts)
      ? R.chain(
          (account) => R.chain((region) => region.label, account.regions),
          accounts
        )
      : R.chain(
          (account) => R.chain((region) => region.label, account.regions),
          selectedAccounts
        )
    : R.chain((region) => region.label, selectedRegions);
};
