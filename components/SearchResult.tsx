import React from 'react';
import { usePageContext } from '../utils/usePageContext';
import { cn } from '../utils/cn';

const SearchResult = ({ result }) => {
  const { selectedCitation } = usePageContext();

  return (
    <div
      className="border-b border-gray-300 py-8 text-stone-900 flex scroll-mt-6"
      id={result.index}
    >
      <p
        className={cn(
          'px-2 rounded-md border h-fit mr-2',
          selectedCitation === `${result.index}` && 'bg-gray-900 text-white'
        )}
      >
        {result.index}
      </p>
      <div>
        <p className="mb-2 font-light">
          <span className="font-semibold">Snippet: </span>
          {result.segment.text}
        </p>
        <div className="flex gap-1">
          <p className="font-semibold">Source:</p>
          <a
            className="hover:cursor-pointer hover:underline w-fit text-blue-600"
            href={result.rawData.c_file.url}
          >
            <div>{result.rawData.name}</div>
          </a>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold">Relevance Score:</p>
          <p className="font-light">{result.segment.score}</p>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
