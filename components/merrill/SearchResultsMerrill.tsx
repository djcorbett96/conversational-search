import React from 'react';
import SearchResultMerrill from './SearchResultMerrill';

const SearchResultsMerrill = ({ results }) => {
  return (
    <section className="flex flex-col">
      {results.map((result) => {
        return (
          <SearchResultMerrill
            key={`${result.id}-${result.index}`}
            result={result}
          />
        );
      })}
    </section>
  );
};

export default SearchResultsMerrill;
