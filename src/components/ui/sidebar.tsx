import { PropsWithChildren } from 'react';
import { Button } from '~/components/ui/button';
import { Icon } from './icons';

export const Sidebar = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="fixed right-0 top-8 z-10 mb-4 h-full w-3/4 animate-enterFromRight overflow-y-scroll border-l-4 bg-slate-100 p-5 pb-8 text-center md:w-1/2 lg:w-1/3">
      {children}
    </div>
  );
};

const CloseButton = ({ onClose }: { onClose: () => void }) => (
  <Button
    variant="card"
    onClick={onClose}
    className="block w-full bg-red-300 text-red-50 hover:bg-red-400 hover:text-red-50"
  >
    Close
  </Button>
);

const Content = ({ children }: PropsWithChildren<{}>) => (
  <div className="my-2 flex flex-col items-center space-y-1.5 text-left">{children}</div>
);

const Separator = () => <hr className="my-2 border-slate-300" />;

const StarBar = ({ children }: PropsWithChildren<{}>) => (
  <div className="my-3 flex justify-center">
    <p className="flex items-center space-x-3 text-center text-lg">
      <Icon.Star className="text-yellow-500" />
      {children}
      <Icon.Star className="text-yellow-500" />
    </p>
  </div>
);

Sidebar.CloseButton = CloseButton;
Sidebar.Content = Content;
Sidebar.Separator = Separator;
Sidebar.StarBar = StarBar;
