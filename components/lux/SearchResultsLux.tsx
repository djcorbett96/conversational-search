import React from 'react';
import SearchResultLux from './SearchResultLux';

const SearchResultsLux = ({ results }) => {
  return (
    <section className="flex flex-col">
      {results.map((result) => {
        return (
          <SearchResultLux
            key={`${result.id}-${result.index}`}
            result={result}
          />
        );
      })}
    </section>
  );
};

export default SearchResultsLux;
