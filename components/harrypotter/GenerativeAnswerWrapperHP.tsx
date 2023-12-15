import React from 'react';
import { sanitizeCitations } from '../../utils/citations/sanitizeCitations';
import GenerativeAnswer from '../GenerativeAnswer';
import { extractCitations } from '../../utils/citations/extractCitations';
import { testResults } from '../../utils/testResults';
import SourcesHP from './SourcesHP';
import { GrResources } from 'react-icons/gr';
import { SlSpeech } from 'react-icons/sl';
import { Result } from '@yext/search-headless-react';

type Props = {
  answer: string;
  results: Result[];
};

export default function GenerativeAnswerWrapperHP({ answer, results }: Props) {
  // const searchResults = testResults;
  const searchResults = results;
  const rawSummary = answer;
  const unorderedSummary = sanitizeCitations(rawSummary);
  const citations = extractCitations(rawSummary);
  const filteredCitations = citations.filter((citation) => citation.references);
  const newIndex = filteredCitations.map((citation) =>
    parseInt(citation.references[0])
  );
  const uniqueIndex = new Set(newIndex);
  const finalIndex = [];
  uniqueIndex.forEach((i) => finalIndex.push(i));
  const sourcesArray = finalIndex.map((i) => {
    const source = searchResults.find((result) => result.index === i);
    return source;
  });

  return (
    <div className="flex flex-col gap-8 mb-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <SlSpeech className="h-5 w-5" />
          <h3 className="text-lg">Answer</h3>
        </div>
        <GenerativeAnswer answer={unorderedSummary} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <GrResources className="h-5 w-5" />
          <h3 className="text-lg">Sources</h3>
        </div>
        <SourcesHP sources={sourcesArray} />
      </div>
    </div>
  );
}
