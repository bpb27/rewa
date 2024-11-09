import { PropsWithChildren } from 'react';
import { cn } from '~/utils/style';
import { SidebarActions } from '~/utils/use-sidebar';
import { Crate } from './box';
import { Button } from './button';
import { Icon } from './icons';
import { Text } from './text';

type SidebarProps = PropsWithChildren<{ thin?: boolean; title: string } & SidebarActions>;

export const Sidebar = ({ backSidebar, children, closeSidebar, thin, title }: SidebarProps) => {
  return (
    <div
      className={cn(
        'w-3/4 md:w-1/2',
        thin ? 'lg:w-1/4' : 'lg:w-1/3',
        'fixed right-0 top-8 z-10 mb-4 h-full animate-enterFromRight overflow-y-scroll bg-slate-800 text-center text-slate-100 shadow-xl'
      )}
    >
      <button
        className="fixed flex h-full cursor-pointer items-center bg-sky-900 text-slate-300 hover:bg-sky-700"
        role="button"
        onClick={closeSidebar}
      >
        <Icon.CaretRight />
      </button>
      <Crate column fullWidth pt={5} pb={10} pr={8} pl={10} gap={3}>
        <Crate className="justify-between" alignCenter gap={3}>
          <Button
            onClick={backSidebar}
            variant="icon"
            className="bg-transparent text-sky-400 ring-2 ring-inset ring-sky-800 hover:bg-sky-700"
          >
            <Icon.ArrowLeft />
          </Button>
          <Text bold className="text-md text-center sm:text-lg">
            {title}
          </Text>
          <Button
            onClick={closeSidebar}
            variant="icon"
            className="bg-transparent text-red-600 ring-2 ring-inset ring-red-800 hover:bg-red-400"
          >
            <Icon.Close />
          </Button>
        </Crate>
        {children}
      </Crate>
    </div>
  );
};
