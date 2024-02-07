import {
  ResultsCount,
  SearchBar,
  SpellCheck,
  onSearchFunc,
} from '@yext/search-ui-react';
import React, { useState } from 'react';
import {
  HeadlessConfig,
  SearchHeadlessProvider,
  provideHeadless,
  useSearchActions,
  useSearchState,
} from '@yext/search-headless-react';
import { fetchAnswer } from '../utils/fetchAnswer';
import { PageContextProvider } from '../utils/usePageContext';
import { testResults } from '../utils/testResults';
import { testAnswer } from '../utils/testAnswer';
import { usePageSetupEffect } from '../utils/usePageSetupEffect';
import ScrollToTopButton from '../components/ScrollButton';
import { AnimatePresence, motion } from 'framer-motion';
import { Bars } from 'react-loading-icons';
import {
  ChatBubbleLeftEllipsisIcon,
  ChatBubbleLeftIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { BsArrowLeft } from 'react-icons/bs';
import { ChatPanel } from '@yext/chat-ui-react';
import {
  ChatConfig,
  ChatHeadlessProvider,
  useChatActions,
  useChatState,
} from '@yext/chat-headless-react';
import GenerativeAnswerWrapperHH from '../components/hitchhikers/GenerativeAnswerWrapperHH';
import SearchResultsHH from '../components/hitchhikers/SearchResultsHH';
import { Skeleton } from '../components/Skeleton';
import { FaWandMagicSparkles } from 'react-icons/fa6';

const config: HeadlessConfig = {
  apiKey: '01db1d1e5ebbaa7ea2e6807ad2196ab3',
  experienceKey: 'yext-help-hitchhikers-vector-search',
  locale: 'en',
  verticalKey: 'content',
};

const chatConfig: ChatConfig = {
  apiKey: '3f787a8ed5b5092b61932982f6837316',
  botId: 'hitchhikers-chat',
};

export default function Hitchhikers(): JSX.Element {
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
  const [answer, setAnswer] = React.useState(null);
  const [selectedCitation, setSelectedCitation] = React.useState(null);
  const isLoading = useSearchState((state) => state.searchStatus.isLoading);
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
      isLoading === false &&
      generatingAnswer === false
    ) {
      const generateAnswer = async () => {
        setGeneratingAnswer(true);
        const generatedAnswer = await fetchAnswer(
          currentQuery,
          verticalResults
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
        isLoading,
      }}
    >
      <AnimatePresence>
        {!chatMode && (
          <>
            <div className="flex justify-center py-6">
              <div className="w-full flex flex-col items-center gap-4">
                <div className="w-full max-w-3xl flex flex-col">
                  <SearchBar
                    onSearch={handleSearch}
                    placeholder="Ask a question about Yext..."
                  />
                  <SpellCheck />
                </div>
                {currentQuery && (
                  <div className="max-w-3xl w-full flex flex-col border-gray-300 border p-4 rounded-lg shadow-md mb-4">
                    <GenerativeAnswerWrapperHH
                      results={verticalResults}
                      answer={answer}
                    />
                  </div>
                )}
                {/* {currentQuery && generatingAnswer && (
                  <div className="max-w-3xl w-full flex flex-col border-gray-300 border p-4 rounded-lg shadow-md mb-4">
                    <div className="flex w-full items-center gap-4 h-12">
                      <ChatBubbleOvalLeftEllipsisIcon className="h-7 w-7 animate-pulse text-slate-900/20" />
                      <div className="space-y-2 flex flex-col w-full">
                        <Skeleton className="h-4" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </div>
                )} */}
                <div className="w-full flex flex-col max-w-3xl">
                  <section className="flex flex-col">
                    {verticalResults &&
                    verticalResults.length > 0 &&
                    currentQuery &&
                    !isLoading ? (
                      <>
                        <ResultsCount />
                        <SearchResultsHH results={verticalResults} />
                      </>
                    ) : isLoading ? (
                      <div className="flex flex-col gap-4">
                        {[...Array(10)].map((i, item) => {
                          return (
                            <div
                              className="border border-gray-300 px-8 py-4 rounded-lg text-stone-900 flex scroll-mt-6"
                              key={i}
                            >
                              <div className="space-y-4 flex flex-col w-full">
                                <Skeleton className="h-4" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-20" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <></>
                    )}
                  </section>
                </div>
              </div>
            </div>
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
            className="flex w-3/4 h-full absolute top-0 right-0 object-cover bg-white"
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
