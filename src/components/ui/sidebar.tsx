import { PropsWithChildren } from 'react';
import { cn } from '~/utils/style';
import { SidebarActions } from '~/utils/use-sidebar';
import { Crate } from './box';
import { Button } from './button';
import { Icon } from './icons';

type SidebarProps = PropsWithChildren<{ thin?: boolean } & SidebarActions>;

export const Sidebar = ({ backSidebar, children, closeSidebar, thin }: SidebarProps) => {
  return (
    <div
      className={cn(
        'w-3/4 md:w-1/2',
        thin ? 'lg:w-1/4' : 'lg:w-1/3',
        'fixed right-0 top-8 z-10 mb-4 h-full animate-enterFromRight overflow-y-scroll border-l-2 border-l-slate-300 bg-slate-100 text-center shadow-xl'
      )}
    >
      <button
        className="fixed top-1/2 flex h-20 cursor-pointer items-center rounded-r-2xl border-2 border-l-0 border-slate-300 bg-slate-100 text-slate-400 hover:border-red-500 hover:bg-red-300 hover:text-red-100"
        role="button"
        onClick={closeSidebar}
      >
        <Icon.CaretRight />
      </button>
      <Crate column fullWidth pt={5} pb={10} px={8} gap={3}>
        <Crate className="justify-between">
          <Button
            onClick={backSidebar}
            variant="icon"
            className="bg-blue-100 text-blue-400 ring-2 ring-inset ring-blue-200 hover:bg-blue-200"
          >
            <Icon.ArrowLeft />
          </Button>
          <Button
            onClick={closeSidebar}
            variant="icon"
            className="bg-red-100 text-red-400 ring-2 ring-inset ring-red-200 hover:bg-red-200"
          >
            <Icon.Close />
          </Button>
          {/* <button
            className="mb-2 rounded-md bg-red-300 p-1 text-red-50 ring-2 ring-inset ring-red-500 hover:bg-red-400"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="mb-2 rounded-md bg-red-300 p-1 text-red-50 ring-2 ring-inset ring-red-500 hover:bg-red-400"
            onClick={onClose}
          >
            Close
          </button> */}
        </Crate>
        {children}
      </Crate>
    </div>
  );
};
