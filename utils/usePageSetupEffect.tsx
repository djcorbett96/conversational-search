import { useSearchActions } from '@yext/search-headless-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const usePageSetupEffect = (verticalKey?: string) => {
  const location = useRouter();
  const searchActions = useSearchActions();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchActions.setQuery(searchParams.get('query') || '');
    searchActions.executeVerticalQuery();
  }, [location, searchActions]);
};
