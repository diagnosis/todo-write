

import { useState } from 'react';

export default function useListView() {
  const [isListView, setIsListView] = useState(false);

  const toggleView = () => {
    setIsListView(prevView => !prevView);
  };

  return { isListView, toggleView };
}