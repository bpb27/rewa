import { useState, type PropsWithChildren, useEffect, useRef } from 'react';
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
}: DialogOverlayProps) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [offScreen, setOffScreen] = useState(false);

  useEffect(() => {
    const rightPosition = ref?.getBoundingClientRect()?.right || 0;
    setOffScreen(rightPosition > window.innerWidth);
  }, [ref]);

  return (
    <Dialog.Root modal={false} open={isOpen}>
      <Dialog.Portal container={container}>
        <Dialog.Content
          ref={setRef}
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
