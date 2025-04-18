import { useEffect, useState } from 'react'

function useDebounce<T>(value: T, delay: 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay])

  return debounced;
}

export default useDebounce;