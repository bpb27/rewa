import { cva, type VariantProps } from 'cva';
import { PropsWithChildren } from 'react';
import { cn } from '~/utils/style';

const boxClasses = cva(['box', 'box-border'], {
  variants: {
    layout: {
      column: 'flex flex-col',
      columnCentered: 'flex flex-col items-center',
      flex: 'flex',
    },
    m: {
      '0': 'm-0',
      '2': 'm-2',
      '4': 'm-4',
      '8': 'm-8',
    },
    p: {
      '0': 'p-0',
      '2': 'p-2',
      '4': 'p-4',
      '8': 'p-8',
    },
  },
  defaultVariants: {
    layout: 'flex',
    m: '0',
    p: '0',
  },
});

interface BoxProps extends VariantProps<typeof boxClasses> {
  className?: string;
  native?: React.HTMLAttributes<HTMLDivElement>;
}

export const Box: React.FC<PropsWithChildren<BoxProps>> = ({
  className,
  children,
  layout,
  m,
  p,
  native,
}) => {
  const bc = boxClasses({ className, layout, m, p });
  const classes = cn(native?.onClick ? 'cursor-pointer' : '', bc);
  return (
    <div className={classes} {...native}>
      {children}
    </div>
  );
};
