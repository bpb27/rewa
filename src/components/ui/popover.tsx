import * as Popover from '@radix-ui/react-popover';
import { Icon } from './icons';
import { cn } from '~/utils/style';
import { PropsWithChildren } from 'react';

type PopoverProps = PropsWithChildren<{
  trigger: JSX.Element;
}>;

export const PopoverMenu = ({ children, trigger }: PopoverProps) => (
  <Popover.Root>
    <Popover.Trigger asChild>{trigger}</Popover.Trigger>
    <Popover.Portal>
      <Popover.Content
        className={cn(
          'w-[260px] rounded border-2 border-slate-500 bg-white p-5 shadow-xl',
          'will-change-[transform,opacity] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade'
        )}
        sideOffset={5}
      >
        {children}
        <Popover.Close
          className="absolute right-[5px] top-[5px] inline-flex h-[25px] w-[25px] cursor-pointer items-center justify-center rounded-full outline-none"
          aria-label="Close"
        >
          <Icon.Close />
        </Popover.Close>
        <Popover.Arrow className="fill-slate-600" height={10} width={15} />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);
