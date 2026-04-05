import { useState } from 'react';

export function usePro() {
  const [isPro, setIsPro] = useState(false); // Always false in free version UI demo
  return { isPro, setIsPro };
}
