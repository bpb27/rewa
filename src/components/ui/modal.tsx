import * as Dialog from '@radix-ui/react-dialog';
import { PropsWithChildren } from 'react';
import { cn } from '~/utils/style';
import { Icon } from './icons';

export type ModalProps = PropsWithChildren<{
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}>;

export const Modal = ({ children, className, isOpen, onClose }: ModalProps) => {
  return (
    <Dialog.Root modal={true} open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-blue-950 opacity-70" />
        <Dialog.Content
          className={cn(
            'fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] overflow-y-scroll rounded-2xl bg-white p-6 focus:outline-none',
            className
          )}
          onInteractOutside={() => onClose()}
        >
          <Dialog.Close asChild onClick={onClose}>
            <Icon.Close className="z-100 absolute right-1 top-1 cursor-pointer stroke-slate-800" />
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
