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
        'fixed right-0 top-8 z-10 mb-4 h-full animate-enterFromRight overflow-y-scroll border-l-2 border-l-slate-300 bg-slate-100 text-center shadow-xl'
      )}
    >
      <button
        className="fixed top-1/2 flex h-20 cursor-pointer items-center rounded-r-2xl border-2 border-l-0 border-slate-300 bg-slate-100 text-slate-400 hover:border-red-500 hover:bg-red-300 hover:text-red-100"
        role="button"
        onClick={onClose}
      >
        <Icon.CaretRight />
      </button>
      <Crate column fullWidth pt={5} pb={10} px={8}>
        <button
          className="mb-2 rounded-md bg-red-300 p-1 text-red-50 ring-2 ring-inset ring-red-500 hover:bg-red-400"
          onClick={onClose}
        >
          Close
        </button>
        {children}
      </Crate>
    </div>
  );
};
