import matchSorter, { rankings } from 'match-sorter';

export const filterOptions = (options, { inputValue }) => 
  matchSorter(options, inputValue, {
    keys: [
      { threshold: rankings.CONTAINS, key: 'search' },
      { maxRanking: matchSorter.rankings.EQUAL, key: 'label' }
    ]
  })
