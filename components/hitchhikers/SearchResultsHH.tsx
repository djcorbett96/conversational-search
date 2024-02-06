import React from 'react';
import SearchResultHH from './SearchResultHH';
import { Skeleton } from '../Skeleton';

const SearchResultsHH = ({ results }) => {
  return (
    <section className="flex flex-col gap-4">
      {results.map((result) => {
        return (
          <SearchResultHH
            key={`${result.id}-${result.index}`}
            result={result}
          />
        );
      })}
    </section>
  );
};

export default SearchResultsHH;
