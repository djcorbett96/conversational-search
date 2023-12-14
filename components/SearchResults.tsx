import React from 'react';
import SearchResult from './SearchResult';

const SearchResults = ({ results }) => {
  return (
    <section className="flex flex-col">
      {results.map((result) => {
        return (
          <SearchResult key={`${result.id}-${result.index}`} result={result} />
        );
      })}
    </section>
  );
};

export default SearchResults;
