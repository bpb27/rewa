import * as Dialog from '@radix-ui/react-dialog';
import { type PropsWithChildren } from 'react';
import { cn } from '~/utils/style';
import { useOverflowedOffScreen } from '~/utils/use-overflowed-off-screen';

type DialogOverlayProps = PropsWithChildren<{
  // ariaTitle: string;
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
}: DialogOverlayProps) => {
  const { offScreen, setOffScreenRef } = useOverflowedOffScreen();
  return (
    <Dialog.Root modal={false} open={isOpen}>
      <Dialog.Portal container={container}>
        <Dialog.Content
          ref={setOffScreenRef}
          className={cn('absolute z-10', offScreen ? 'right-0' : '', className)}
          onEscapeKeyDown={onClose}
          onInteractOutside={e => {
            e.preventDefault();
            onClose();
          }}
          onOpenAutoFocus={e => e.preventDefault()}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
