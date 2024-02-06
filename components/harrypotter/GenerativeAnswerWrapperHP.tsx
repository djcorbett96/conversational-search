import React from 'react';
import { sanitizeCitations } from '../../utils/citations/sanitizeCitations';
import GenerativeAnswer from '../GenerativeAnswer';
import SourcesHP from './SourcesHP';
import { GrResources } from 'react-icons/gr';
import { Result } from '@yext/search-headless-react';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import { usePageContext } from '../../utils/usePageContext';
import FollowUpButton from '../FollowUpButton';

type Props = {
  answer: string;
  results: Result[];
};

export default function GenerativeAnswerWrapperHP({ answer, results }: Props) {
  const { generatingAnswer } = usePageContext();
  // const searchResults = testResults;
  const searchResults = results;
  const rawSummary = answer;
  const answerCitationSplit = sanitizeCitations(rawSummary);
  const cleanAnswer = answerCitationSplit && answerCitationSplit[0];
  const citationsArray =
    answerCitationSplit && JSON.parse(answerCitationSplit[1]);
  const sourcesArray =
    citationsArray &&
    citationsArray.map((i) => {
      const source = searchResults.find((result) => result.id === i);
      return source;
    });

  return (
    <div className="w-full flex flex-col gap-6 max-w-3xl text-[#0a3366]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <FaWandMagicSparkles className="h-5 w-5" />
          <h3 className="text-lg">Generative Answer</h3>
        </div>
        <GenerativeAnswer answer={cleanAnswer} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <GrResources className="h-5 w-5" />
          <h3 className="text-lg">Sources</h3>
        </div>
        <SourcesHP sources={sourcesArray} />
      </div>
      <FollowUpButton />
    </div>
  );
}
