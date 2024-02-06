import React from 'react';
import { sanitizeCitations } from '../../utils/citations/sanitizeCitations';
import GenerativeAnswer from '../GenerativeAnswer';
import SourcesHH from './SourcesHH';
import { GrResources } from 'react-icons/gr';
import { Result } from '@yext/search-headless-react';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import { usePageContext } from '../../utils/usePageContext';
import FollowUpButton from '../FollowUpButton';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';

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

  return answerCitationSplit ? (
    <div className="w-full flex flex-col gap-4 max-w-3xl">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold bg-sky-300/20 px-3 py-1 text-blue-900 rounded-md">
            AI generated answer
          </h3>
        </div>
        <GenerativeAnswer answer={cleanAnswer} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h3>Sources</h3>
        </div>
        <SourcesHH sources={sourcesArray} />
      </div>
      <FollowUpButton />
    </div>
  ) : (
    <div className="flex justify-start items-center gap-2 h-12 text-gray-700">
      <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
      <h3 className="">
        Sorry, we were unable to generate an answer based on the search results
      </h3>
    </div>
  );
}
