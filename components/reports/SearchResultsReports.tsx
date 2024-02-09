import React from 'react';
import SearchResultHP from './SearchResultReports';

const SearchResultsReports = ({ results }) => {
  return (
    <section className="flex flex-col">
      {results.map((result) => {
        return (
          <SearchResultHP
            key={`${result.id}-${result.index}`}
            result={result}
          />
        );
      })}
    </section>
  );
};

export default SearchResultsReports;
