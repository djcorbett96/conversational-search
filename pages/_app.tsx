import '../styles/globals.css';
import {
  provideHeadless,
  SearchHeadlessProvider,
  type HeadlessConfig,
} from '@yext/search-headless-react';
import React from 'react';

const config: HeadlessConfig = {
  apiKey: 'b083465ee2ad3d23460e150c6a297f7f',
  experienceKey: 'vector-search',
  locale: 'en',
  verticalKey: 'books-new',
};

function MyApp({ Component, pageProps }): JSX.Element {
  const searcher = provideHeadless(config);
  return (
    <SearchHeadlessProvider searcher={searcher}>
      <Component {...pageProps} />
    </SearchHeadlessProvider>
  );
}

export default MyApp;
