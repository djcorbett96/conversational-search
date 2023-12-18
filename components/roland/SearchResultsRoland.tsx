import React from 'react';
import SearchResultRoland from './SearchResultRoland';

const SearchResultsRoland = ({ results }) => {
  return (
    <section className="flex flex-col">
      {results.map((result) => {
        return (
          <SearchResultRoland
            key={`${result.id}-${result.index}`}
            result={result}
          />
        );
      })}
    </section>
  );
};

export default SearchResultsRoland;
