import {
  ApplyFiltersButton,
  FilterSearch,
  OnSelectParams,
  SearchBar,
  SpellCheck,
  StandardCard,
  VerticalResults,
  onSearchFunc,
} from '@yext/search-ui-react';
import React from 'react';
import {
  HeadlessConfig,
  SearchHeadlessProvider,
  SelectableStaticFilter,
  provideHeadless,
  useSearchActions,
  useSearchState,
} from '@yext/search-headless-react';

const config: HeadlessConfig = {
  apiKey: 'b083465ee2ad3d23460e150c6a297f7f',
  experienceKey: 'locator',
  locale: 'en',
  verticalKey: 'locations',
};

export default function Locator(): JSX.Element {
  const searcher = provideHeadless(config);
  return (
    <SearchHeadlessProvider searcher={searcher}>
      <Inner />
    </SearchHeadlessProvider>
  );
}

function Inner() {
  const resultCount = useSearchState((state) => state.vertical.resultsCount);
  const verticalResults = useSearchState((state) => state.vertical.results);
  const filtersArray = useSearchState((state) => state.filters.static) || [];
  const selectedFilter = filtersArray.filter(
    (filter) => filter.selected === true
  );
  const searchActions = useSearchActions();

  const handleFilterSelect = ({
    newFilter,
    newDisplayName,
    setCurrentFilter,
  }: OnSelectParams) => {
    console.log(newFilter);
    console.log(newDisplayName);
    setCurrentFilter(newFilter);
    const locationFilter: SelectableStaticFilter = {
      filter: newFilter,
      selected: true,
      displayName: newDisplayName,
    };
    searchActions.setStaticFilters([locationFilter]);
    searchActions.executeVerticalQuery();
  };
  return (
    <section className="py-10 max-w-3xl mx-auto flex flex-col gap-4">
      <FilterSearch
        searchFields={[
          { fieldApiName: 'builtin.location', entityType: 'location' },
        ]}
        onSelect={handleFilterSelect}
      />
      {verticalResults && (
        <div>{`${resultCount} for "${selectedFilter[0]?.displayName}"`}</div>
      )}
      <VerticalResults CardComponent={StandardCard} />
    </section>
  );
}
