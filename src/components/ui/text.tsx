import { PropsWithChildren } from 'react';
import { cn } from '~/utils/style';
import { Icon } from './icons';

type TextProps = PropsWithChildren<{
  bold?: boolean;
  clickable?: boolean;
  icon?: keyof typeof Icon;
  noWrap?: boolean;
  onClick?: () => void;
  secondary?: boolean;
}>;

export const Text = ({
  clickable,
  onClick,
  bold,
  icon,
  children,
  noWrap = true,
  secondary,
  ...rest
}: TextProps) => {
  const TextIcon = icon && icon in Icon ? Icon[icon] : null;
  //   const textProps = {
  //     ...(onClick ? { onClick } : undefined),
  //     ...rest,
  //   };
  return (
    <span
      className={cn(
        'flex gap-x-2',
        noWrap && 'whitespace-nowrap',
        bold && 'font-bold',
        (onClick || clickable) && 'cursor-pointer hover:underline',
        secondary && 'text-slate-500'
      )}
      onClick={onClick}
      //   {...textProps}
    >
      {TextIcon && <TextIcon />}
      {children}
    </span>
  );
};
