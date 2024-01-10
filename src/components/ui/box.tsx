import { type PropsWithChildren } from 'react';
import { keys } from '~/utils/object';
import { cn } from '~/utils/style';

export type Box = React.FC<PropsWithChildren<{}>>;
export type Boxes = Record<string, Box>;

export const Sidebar: Box = ({ children }) => (
  <div className="fixed right-0 top-8 z-10 h-full w-3/4 overflow-y-scroll border-l-4 bg-slate-100 p-5 pb-8 text-center md:w-1/2 lg:w-1/4">
    {children}
  </div>
);

type NumericalSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type SpaceDirection = 'x' | 'y' | 't' | 'b' | 'l' | 'r';
type Padding = 'p' | `p${SpaceDirection}`;
type Margin = 'm' | `m${SpaceDirection}`;
type CrateProps = PropsWithChildren<{
  className?: string;
  column?: boolean;
  justifyCenter?: boolean;
  alignCenter?: boolean;
  hide?: boolean;
  overflowScroll?: boolean;
  gap?: NumericalSize;
  fullWidth?: boolean;
}> &
  Partial<Record<Padding, NumericalSize>> &
  Partial<Record<Margin, NumericalSize>>;

export const Crate = ({
  className,
  column,
  justifyCenter,
  alignCenter,
  children,
  overflowScroll,
  hide,
  fullWidth,
  ...direct
}: CrateProps) => (
  <div
    className={cn(
      'flex',
      column && 'flex-col',
      alignCenter && 'items-center',
      justifyCenter && 'justify-center',
      overflowScroll && 'overflow-scroll',
      keys(direct).reduce((acc, key) => acc + ` ${key}-${direct[key]}`, ''),
      hide && 'hidden',
      fullWidth && 'w-full',
      className
    )}
  >
    {children}
  </div>
);
