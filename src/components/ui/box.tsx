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
  column?: boolean;
  centered?: boolean;
}> &
  Partial<Record<Padding, NumericalSize>> &
  Partial<Record<Margin, NumericalSize>>;

export const Crate = ({ column, centered, children, ...direct }: CrateProps) => (
  <div
    className={cn(
      'flex',
      column && 'flex-col',
      centered && column && 'items-center',
      centered && !column && 'justify-center',
      keys(direct).reduce((acc, key) => acc + ` ${key}-${direct[key]}`, '')
    )}
  >
    {children}
  </div>
);

export const FakeThingForTailwind = () => {
  return (
    <div
      className="
p-1 p-2 p-3 p-4
px-1 px-2 px-3 px-4
py-1 py-2 py-3 py-4
pb-1 pb-2 pb-3 pb-4
pl-1 pl-2 pl-3 pl-4
pr-1 pr-2 pr-3 pr-4
pt-1 pt-2 pt-3 pt-4
  "
    ></div>
  );
};
