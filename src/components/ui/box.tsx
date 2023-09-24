import { type PropsWithChildren } from 'react';

export type Box = React.FC<PropsWithChildren<{}>>;
export type Boxes = Record<string, Box>;

export const Sidebar: Box = ({ children }) => (
  <div className="fixed right-0 top-8 z-10 h-full w-3/4 overflow-y-scroll border-l-4 bg-slate-100 p-5 pb-8 text-center md:w-1/2 lg:w-1/4">
    {children}
  </div>
);
