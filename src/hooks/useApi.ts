import { useState, useEffect, useRef, DependencyList } from 'react';

export interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: DependencyList = []
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [revision, setRevision] = useState(0);
  // Only show the loading skeleton on the very first fetch — background
  // refetches (polling) update data silently without flashing skeletons.
  const hasLoaded = useRef(false);

  useEffect(() => {
    let live = true;
    if (!hasLoaded.current) setIsLoading(true);
    // Only clear a previous error when we've already had a successful load (background poll).
    // On the very first load / manual retry, keep showing loading state; don't flash error→loading.
    if (hasLoaded.current) setError(null);
    fetcher()
      .then(result => {
        if (live) {
          hasLoaded.current = true;
          setData(result);
          setIsLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (live) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setIsLoading(false);
        }
      });
    return () => {
      live = false;
    };
    // fetcher identity changes every render; deps + revision drive re-runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, revision]);

  return {
    data,
    isLoading,
    error,
    refetch: () => setRevision(r => r + 1),
  };
}
