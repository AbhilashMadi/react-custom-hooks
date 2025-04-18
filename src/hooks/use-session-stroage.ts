import { useEffect, useState } from "react";

function useSessionStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const json = sessionStorage.getItem(key)
    return json ? JSON.parse(json) : initialValue;
  })

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as const;
}

export default useSessionStorage;