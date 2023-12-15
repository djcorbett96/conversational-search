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
import Loading from '../components/Loading';
import GenerativeAnswerWrapperHP from '../components/harrypotter/GenerativeAnswerWrapperHP';
import { PageContextProvider } from '../utils/usePageContext';
import { testResults } from '../utils/testResults';
import { testAnswer } from '../utils/testAnswer';
import Divider from '../components/Divider';
import { MdOutlineManageSearch } from 'react-icons/md';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import SearchResultsHP from '../components/harrypotter/SearchResultsHP';
import { usePageSetupEffect } from '../utils/usePageSetupEffect';
import ScrollToTopButton from '../components/ScrollButton';

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
  const verticalResults = useSearchState((state) => state.vertical.results);
  // const verticalResults = testResults;
  const currentQuery = useSearchState((state) => state.query.mostRecentSearch);
  const [generatingAnswer, setGeneratingAnswer] = React.useState(false);
  const [answer, setAnswer] = React.useState();
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

  React.useEffect(() => {
    if (
      verticalResults &&
      verticalResults.length > 0 &&
      generatingAnswer === false
    ) {
      const generateAnswer = async () => {
        setGeneratingAnswer(true);
        const generatedAnswer = await fetchAnswer(
          currentQuery,
          verticalResults
        );
        setAnswer(generatedAnswer);
        setGeneratingAnswer(false);
      };
      generateAnswer().catch((error) => console.log('error', error));
    }
  }, [verticalResults]);

  return (
    <PageContextProvider
      value={{
        selectedCitation,
        setSelectedCitation,
      }}
    >
      <div className="flex justify-center px-4 py-6">
        <div className="w-full max-w-3xl flex flex-col">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Test your knowledge of the wizarding world..."
          />
          <SpellCheck />
          {generatingAnswer && (
            <div className="flex items-center gap-2">
              <Loading />
              <p>Generating answer...</p>
            </div>
          )}
          {!generatingAnswer && answer && (
            <GenerativeAnswerWrapperHP
              results={verticalResults}
              answer={answer}
            />
          )}
          {currentQuery && answer && !generatingAnswer && <Divider />}
          <section className="flex flex-col">
            {verticalResults && verticalResults.length > 0 && currentQuery && (
              <>
                <div className="mt-8 mb-0 py-0 flex gap-2 items-center">
                  <MdOutlineManageSearch className="w-5 h-5" />
                  <h3 className="text-lg">Raw Results</h3>
                </div>
                <SearchResultsHP results={verticalResults} />
              </>
            )}
          </section>
        </div>
      </div>
      <ScrollToTopButton />
    </PageContextProvider>
  );
}
