import { cn } from '~/utils/style';

type SpaceProps = {
  h?: 1 | 2 | 3;
  w?: 1 | 2 | 3;
};

export const Space = ({ h, w }: SpaceProps) => (
  <div
    className={cn(
      w === 1 && 'w-1',
      w === 2 && 'w-2',
      w === 3 && 'w-3',
      h === 1 && 'h-1',
      h === 2 && 'h-2',
      h === 3 && 'h-3'
    )}
  />
);
