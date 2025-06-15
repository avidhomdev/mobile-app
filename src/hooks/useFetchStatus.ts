import { useState, useTransition } from "react";

export function useFetchStatus() {
  const [hasFetched, setHasFetched] = useState(false);
  const [isFetching, startFetching] = useTransition();

  return {
    setHasFetched,
    isFetching: isFetching || !hasFetched,
    startFetching,
  };
}
