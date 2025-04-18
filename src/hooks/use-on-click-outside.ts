import { RefObject, useEffect } from 'react';

function useOnClickOutside(ref: RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listner = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    }

    document.addEventListener('mousedown', listner);
    return () => document.removeEventListener('mousedown', listner);
  }, [ref, handler])

}

export default useOnClickOutside;