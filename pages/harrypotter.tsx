import { SearchBar, SpellCheck, onSearchFunc } from '@yext/search-ui-react';
import React from 'react';
import {
  HeadlessConfig,
  SearchHeadlessProvider,
  provideHeadless,
  useSearchActions,
  useSearchState,
} from '@yext/search-headless-react';
import { fetchAnswer } from '../utils/fetchAnswer';
import GenerativeAnswerWrapperHP from '../components/harrypotter/GenerativeAnswerWrapperHP';
import { PageContextProvider } from '../utils/usePageContext';
import { testResults } from '../utils/testResults';
import { testAnswer } from '../utils/testAnswer';
import SearchResultsHP from '../components/harrypotter/SearchResultsHP';
import { usePageSetupEffect } from '../utils/usePageSetupEffect';
import ScrollToTopButton from '../components/ScrollButton';
import { motion } from 'framer-motion';
import { Bars } from 'react-loading-icons';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

const config: HeadlessConfig = {
  apiKey: 'b083465ee2ad3d23460e150c6a297f7f',
  experienceKey: 'vector-search',
  locale: 'en',
  verticalKey: 'books-new',
};

export default function HarryPotter(): JSX.Element {
  const searcher = provideHeadless(config);
  return (
    <SearchHeadlessProvider searcher={searcher}>
      <Inner />
    </SearchHeadlessProvider>
  );
}

function Inner(): JSX.Element {
  const searchActions = useSearchActions();
  // const verticalResults = useSearchState((state) => state.vertical.results);
  // const currentQuery = useSearchState((state) => state.query.mostRecentSearch);
  const verticalResults = testResults;
  const currentQuery = 'test';
  const [generatingAnswer, setGeneratingAnswer] = React.useState(false);
  const [answer, setAnswer] = React.useState(testAnswer);
  const [selectedCitation, setSelectedCitation] = React.useState(null);
  usePageSetupEffect();

  const handleSearch: onSearchFunc = (searchEventData) => {
    const { query } = searchEventData;
    searchActions.setQuery(query);
    searchActions.executeVerticalQuery();
    const queryParams = new URLSearchParams(window.location.search);

    if (query) {
      queryParams.set('query', query);
    } else {
      queryParams.delete('query');
    }
    history.pushState(null, '', '?' + queryParams.toString());
  };

  // React.useEffect(() => {
  //   if (
  //     verticalResults &&
  //     verticalResults.length > 0 &&
  //     generatingAnswer === false
  //   ) {
  //     const generateAnswer = async () => {
  //       setGeneratingAnswer(true);
  //       const generatedAnswer = await fetchAnswer(
  //         currentQuery,
  //         verticalResults
  //       );
  //       setAnswer(generatedAnswer);
  //       setGeneratingAnswer(false);
  //     };
  //     generateAnswer().catch((error) => console.log('error', error));
  //   }
  // }, [verticalResults]);

  return (
    <PageContextProvider
      value={{
        selectedCitation,
        setSelectedCitation,
        generatingAnswer,
        setGeneratingAnswer,
      }}
    >
      <div className="flex justify-center py-10">
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-3xl flex flex-col">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Test your knowledge of the wizarding world..."
            />
            <SpellCheck />
          </div>
          {currentQuery && (
            <motion.div
              layout
              className="w-full flex flex-col bg-[#e3eefc] items-center"
            >
              <div className="max-w-3xl py-10 w-full">
                {answer && !generatingAnswer && (
                  <GenerativeAnswerWrapperHP
                    results={verticalResults}
                    answer={answer}
                  />
                )}
                {generatingAnswer && (
                  <>
                    <div className="flex items-center gap-2 text-lg text-[#0a3366]">
                      <Bars className="h-5 w-5" fill="#0a3366" speed={0.5} />
                      <p>Generating Answer...</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
          <div className="w-full flex flex-col max-w-3xl">
            {/* {currentQuery && answer && !generatingAnswer && <Divider />} */}
            <section className="flex flex-col">
              {verticalResults &&
                verticalResults.length > 0 &&
                currentQuery && (
                  <>
                    <div className="mt-8 mb-0 py-0 flex gap-2 items-center">
                      <DocumentDuplicateIcon className="w-6 h-6" />
                      <h3 className="text-lg">Search Results</h3>
                    </div>
                    <SearchResultsHP results={verticalResults} />
                  </>
                )}
            </section>
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </PageContextProvider>
  );
}
