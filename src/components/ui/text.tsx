import { PropsWithChildren } from 'react';
import { cn } from '~/utils/style';
import { Icon } from './icons';

type TextProps = PropsWithChildren<{
  bold?: boolean;
  clickable?: boolean;
  icon?: keyof typeof Icon;
  noWrap?: boolean;
  onClick?: () => void;
}>;

export const Text = ({
  clickable,
  onClick,
  bold,
  icon,
  children,
  noWrap = true,
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
        (onClick || clickable) && 'cursor-pointer hover:underline'
      )}
      onClick={onClick}
      //   {...textProps}
    >
      {TextIcon && <TextIcon />}
      {children}
    </span>
  );
};
