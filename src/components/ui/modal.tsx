import * as Dialog from '@radix-ui/react-dialog';
import { PropsWithChildren } from 'react';

export type ModalProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
}>;

export const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  return (
    <Dialog.Root modal={true} open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-blue-950 opacity-70" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] overflow-y-scroll rounded-2xl bg-white p-6 focus:outline-none"
          onInteractOutside={() => onClose()}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
