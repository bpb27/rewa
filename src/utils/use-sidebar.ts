import { useState } from 'react';
import { isSameObject } from './object';

export type SidebarActions = {
  closeSidebar: () => void;
  backSidebar: () => void;
};

export const useSidebar = <TBar extends { variant: string }>() => {
  const [sidebarHistory, setSidebarHistory] = useState<TBar[]>([]);
  const currentIndex = sidebarHistory.length - 1;

  const close = (): void => {
    setSidebarHistory([]);
  };

  const open = (newSidebar: TBar) => {
    console.log(newSidebar);
    sidebarHistory[currentIndex] && isSameObject(newSidebar, sidebarHistory[currentIndex])
      ? close()
      : setSidebarHistory(s => [...s, newSidebar]);
  };

  const back = () => {
    if (sidebarHistory[currentIndex - 1]) {
      setSidebarHistory(sidebarHistory.slice(0, currentIndex)); // eh not quite
    } else {
      close();
    }
  };

  return {
    backSidebar: back,
    closeSidebar: close,
    openSidebar: open,
    sidebar: sidebarHistory[currentIndex] as TBar | undefined,
  };
};
