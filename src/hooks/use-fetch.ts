
// loading, data, error
// url, options
// Aborting requests, chaching
import { useCallback, useEffect, useRef, useState } from "react";

type FetchState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
}

type FetchOptions = RequestInit & {
  retries?: number;
  retryDelay?: number;
  cacheKey?: string;
  enabled?: boolean;
}

const chache = new Map<string, any>();

function useFetch<T>(url: string, options: FetchOptions): FetchState<T> {

  const intialState: FetchState<T> = {
    data: null,
    error: null,
    loading: false,
  }
  const [state, setState] = useState<FetchState<T>>(intialState)
  const { cacheKey = url, enabled = true, retries = 0, retryDelay = 1_000, ...fetchOptions } = options;

  const abortControllerRef = useRef<AbortController | null>(null);
  const retriesRef = useRef<number>(retries);

  const fetchRequest = useCallback(async () => {
    setState({ ...intialState, loading: enabled })

    if (chache.has(cacheKey)) {
      return setState({ ...intialState, data: chache.get(cacheKey) })
    }

    try {
      abortControllerRef.current = new AbortController();
      setState(intialState);
      const resposne = await fetch(url, { ...fetchOptions, signal: abortControllerRef.current?.signal });
      if (resposne.ok) {
        const data = (await resposne.json()).data;
        chache.set(cacheKey, data)
        setState({ data, loading: false, error: null })
      }
    } catch (error) {
      if (retriesRef.current > 0) {
        retriesRef.current -= 1;
        setTimeout(fetchRequest, retryDelay);
      } else {
        setState({ data: null, error: error.message ?? "", loading: false })
      }
    }
  }, [cacheKey, enabled, fetchOptions, intialState, retryDelay, url])

  useEffect(() => {
    fetchRequest();

    return () => { abortControllerRef.current?.abort(); }
  }, [fetchRequest])

  return state;
}

export default useFetch