import React from 'react';
import SearchResultCNO from './SearchResultCNO';

const SearchResultsCNO = ({ results }) => {
  return (
    <section className="flex flex-col">
      {results.map((result) => {
        return (
          <SearchResultCNO
            key={`${result.id}-${result.index}`}
            result={result}
          />
        );
      })}
    </section>
  );
};

export default SearchResultsCNO;
