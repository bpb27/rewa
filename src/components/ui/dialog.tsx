import { type PropsWithChildren } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '~/utils/style';

type DialogOverlayProps = PropsWithChildren<{
  className?: string;
  container: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
}>;

export const DialogOverlay = ({
  children,
  className,
  container,
  onClose,
  isOpen,
}: DialogOverlayProps) => (
  <Dialog.Root modal={false} open={isOpen}>
    <Dialog.Portal container={container}>
      <Dialog.Content
        className={cn('absolute z-10', className)}
        onEscapeKeyDown={onClose}
        onInteractOutside={onClose}
        onOpenAutoFocus={e => e.preventDefault()}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
