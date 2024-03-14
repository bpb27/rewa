import { PropsWithChildren } from 'react';
import { cn } from '~/utils/style';
import { Crate } from './box';
import { Icon } from './icons';

export const Sidebar = ({
  children,
  onClose,
  unfixedWidth,
}: PropsWithChildren<{ onClose: () => void; unfixedWidth?: boolean }>) => {
  return (
    <div
      className={cn(
        !unfixedWidth && 'w-3/4 md:w-1/2 lg:w-1/3',
        'fixed right-0 top-8 z-10 mb-4 h-full animate-enterFromRight overflow-y-scroll border-l-2 border-l-slate-300 bg-slate-100 p-5 pb-8 text-center shadow-xl'
      )}
    >
      <Crate>
        <button
          className="inset fixed top-1/2 -m-11 flex h-20 cursor-pointer items-center rounded-l-2xl bg-slate-300 text-slate-50 ring-2 ring-inset ring-slate-300 hover:bg-slate-400"
          role="button"
          onClick={onClose}
        >
          <Icon.CaretRight />
        </button>
        <Crate column fullWidth>
          <button
            className="mb-2 rounded bg-red-300 text-red-50 ring-2 ring-inset ring-red-500 hover:bg-red-400"
            onClick={onClose}
          >
            Close
          </button>
          {children}
        </Crate>
      </Crate>
    </div>
  );
};

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

Sidebar.Content = Content;
Sidebar.Separator = Separator;
Sidebar.StarBar = StarBar;
