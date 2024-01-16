import React from 'react';
import SearchResultMormon from './SearchResultMormon';

const SearchResultsMormon = ({ results }) => {
  return (
    <section className="flex flex-col">
      {results.map((result) => {
        return (
          <SearchResultMormon
            key={`${result.id}-${result.index}`}
            result={result}
          />
        );
      })}
    </section>
  );
};

export default SearchResultsMormon;
