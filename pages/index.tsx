import {
  Pagination,
  ResultsCount,
  SearchBar,
  SpellCheck,
  VerticalResults,
  onSearchFunc,
} from '@yext/search-ui-react';
import React from 'react';
import { useSearchActions, useSearchState } from '@yext/search-headless-react';
import { fetchAnswer } from '../utils/fetchAnswer';
import Loading from '../components/Loading';
import GenerativeAnswerWrapper from '../components/GenerativeAnswerWrapper';
import SearchResults from '../components/SearchResults';
import { PageContextProvider } from '../utils/usePageContext';
import { testResults } from '../utils/testResults';
import { testAnswer } from '../utils/testAnswer';
import Divider from '../components/Divider';
import { MdOutlineManageSearch } from 'react-icons/md';

export default function Home(): JSX.Element {
  const searchActions = useSearchActions();
  const verticalResults = useSearchState((state) => state.vertical.results);
  // const verticalResults = testResults;
  const currentQuery = useSearchState((state) => state.query.mostRecentSearch);
  const [generatingAnswer, setGeneratingAnswer] = React.useState(false);
  const [answer, setAnswer] = React.useState();
  const [selectedCitation, setSelectedCitation] = React.useState(null);

  const handleSearch: onSearchFunc = (searchEventData) => {
    const { query } = searchEventData;
    searchActions.setQuery(query);
    searchActions.executeVerticalQuery();
  };

  React.useEffect(() => {
    if (verticalResults && verticalResults.length > 0) {
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
            <GenerativeAnswerWrapper answer={answer} />
          )}
          {currentQuery && answer && !generatingAnswer && <Divider />}
          <section className="flex flex-col">
            {currentQuery && (
              <div className="mt-8 mb-0 py-0 flex gap-2 items-center">
                <MdOutlineManageSearch className="w-5 h-5" />
                <h3 className="text-lg">Raw Results</h3>
              </div>
            )}
            {verticalResults && verticalResults.length > 0 && (
              <SearchResults results={verticalResults} />
            )}
          </section>
        </div>
      </div>
    </PageContextProvider>
  );
}
