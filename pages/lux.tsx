import { SearchBar, SpellCheck, onSearchFunc } from '@yext/search-ui-react';
import React, { useState } from 'react';
import {
  HeadlessConfig,
  SearchHeadlessProvider,
  provideHeadless,
  useSearchActions,
  useSearchState,
} from '@yext/search-headless-react';
import { PageContextProvider } from '../utils/usePageContext';
import { testResults } from '../utils/testResults';
import { testAnswer } from '../utils/testAnswer';
import { usePageSetupEffect } from '../utils/usePageSetupEffect';
import ScrollToTopButton from '../components/ScrollButton';
import { AnimatePresence, motion } from 'framer-motion';
import { Bars } from 'react-loading-icons';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { BsArrowLeft } from 'react-icons/bs';
import { ChatPanel } from '@yext/chat-ui-react';
import {
  ChatConfig,
  ChatHeadlessProvider,
  useChatActions,
  useChatState,
} from '@yext/chat-headless-react';
import GenerativeAnswerWrapperLux from '../components/lux/GenerativeAnswerWrapperLux';
import SearchResultsLux from '../components/lux/SearchResultsLux';
import { fetchAnswerLux } from '../utils/fetchAnswerLux';

const config: HeadlessConfig = {
  apiKey: 'c08ff26d70519dd5e377fdcb5f80acfb',
  experienceKey: 'lux-demo',
  locale: 'en',
  verticalKey: 'insights',
};

const chatConfig: ChatConfig = {
  apiKey: 'be97d1e89f5fa81b1f23018246c9b619',
  botId: 'lux-demo-bot',
};

export default function Lux(): JSX.Element {
  const searcher = provideHeadless(config);

  return (
    <ChatHeadlessProvider config={chatConfig}>
      <SearchHeadlessProvider searcher={searcher}>
        <Inner />
      </SearchHeadlessProvider>
    </ChatHeadlessProvider>
  );
}

function Inner(): JSX.Element {
  const searchActions = useSearchActions();
  const verticalResults = useSearchState((state) => state.vertical.results);
  const currentQuery = useSearchState((state) => state.query.mostRecentSearch);
  // const verticalResults = testResults;
  // const currentQuery = 'Who is Albus Dumbledore?';
  const [generatingAnswer, setGeneratingAnswer] = React.useState(false);
  const [answer, setAnswer] = React.useState();
  const [selectedCitation, setSelectedCitation] = React.useState(null);
  const [chatMode, setChatMode] = useState(false);
  const chatActions = useChatActions();
  const totalMessages = useChatState(
    (state) => state.conversation.messages.length
  );
  usePageSetupEffect();

  const handleSearch: onSearchFunc = (searchEventData) => {
    setAnswer(undefined);
    chatActions.restartConversation();
    const { query } = searchEventData;
    searchActions.setQuery(query);
    searchActions.executeVerticalQuery();
    if (totalMessages === 0) {
      chatActions.addMessage({
        source: 'USER',
        text: query,
      });
    }
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
        console.log(verticalResults);
        const cleanedResults = verticalResults.map(
          ({ highlightedFields, ...cleanResult }) => cleanResult
        );
        console.log(cleanedResults);
        const generatedAnswer = await fetchAnswerLux(
          currentQuery,
          cleanedResults
        );
        setAnswer(generatedAnswer);
        chatActions.addMessage({
          source: 'BOT',
          text: generatedAnswer,
        });
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
        generatingAnswer,
        setGeneratingAnswer,
        chatMode,
        setChatMode,
      }}
    >
      <AnimatePresence>
        {!chatMode && (
          <>
            <motion.div
              key="search-ui"
              // initial={{ y: '-100vh' }}
              // animate={{ y: 0 }}
              exit={{ y: '-100vh' }}
              transition={{ duration: 0.3 }}
              className="flex justify-center py-6"
            >
              <div className="w-full flex flex-col items-center">
                <div className="w-full max-w-3xl flex flex-col">
                  <SearchBar
                    onSearch={handleSearch}
                    placeholder="Ask a question about Lux Insights..."
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
                        <GenerativeAnswerWrapperLux
                          results={verticalResults}
                          answer={answer}
                        />
                      )}
                      {generatingAnswer && (
                        <>
                          <div className="flex items-center gap-2 text-lg text-[#0a3366]">
                            <Bars
                              className="h-5 w-5"
                              fill="#0a3366"
                              speed={0.5}
                            />
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
                          <SearchResultsLux results={verticalResults} />
                        </>
                      )}
                  </section>
                </div>
              </div>
            </motion.div>
            <ScrollToTopButton />
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {chatMode && (
          <motion.div
            key="chat-panel"
            initial={{ y: '100vh' }}
            animate={{ y: 0 }}
            exit={{ y: '100vh' }}
            transition={{ duration: 0.3 }}
            className="flex w-full h-full absolute top-0 right-0 object-cover bg-white"
          >
            <div className="w-full h-full shrink-0 relative">
              <button
                className="z-50 absolute top-0 left-8 mt-4 mr-4 text-[#0a3366] bg-white shadow rounded-full px-4 py-2"
                onClick={() => {
                  setChatMode(false);
                }}
              >
                <BsArrowLeft className="inline-block w-4 h-4 mr-2 my-auto mx-auto text-[#0a3366]" />
                Back to Search
              </button>
              <ChatPanel
                customCssClasses={{
                  container: 'shadow-none my-0 w-full p-6',
                  messageBubbleCssClasses: {
                    bubble__user: 'bg-none bg-[#0a3366] py-0 px-4',
                    bubble__bot: 'bg-none bg-[#e3eefc] py-0',
                  },
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContextProvider>
  );
}
