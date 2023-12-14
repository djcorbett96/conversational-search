import React from 'react';
import { sanitizeCitations } from '../utils/citations/sanitizeCitations';
import GenerativeAnswer from './GenerativeAnswer';
import { extractCitations } from '../utils/citations/extractCitations';
import { testResults } from '../utils/testResults';
import Sources from './Sources';
import { GrResources } from 'react-icons/gr';
import { SlSpeech } from 'react-icons/sl';

type Props = {
  answer: string;
};

export default function GenerativeAnswerWrapper({ answer }: Props) {
  const searchResults = testResults;
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
        <Sources sources={sourcesArray} />
      </div>
    </div>
  );
}
