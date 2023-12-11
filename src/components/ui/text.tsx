import { PropsWithChildren } from 'react';
import { cn } from '~/utils/style';
import { Icon } from './icons';

type TextProps = PropsWithChildren<{
  bold?: boolean;
  hide?: boolean;
  icon?: keyof typeof Icon;
  iconOrientation?: 'left' | 'right';
  noWrap?: boolean;
  onClick?: () => void;
  secondary?: boolean;
  size?: 'md' | 'lg' | 'xl';
  tag?: 'span' | 'button';
  textAlign?: 'left' | 'center';
}>;

export const Text = ({
  onClick,
  bold,
  hide,
  icon,
  iconOrientation = 'left',
  children,
  noWrap = true,
  secondary,
  size,
  tag,
  textAlign = 'left',
}: TextProps) => {
  const TextIcon = icon && icon in Icon ? Icon[icon] : null;
  const text = (
    <span
      className={cn(
        'flex gap-x-2',
        noWrap && 'whitespace-nowrap',
        bold && 'font-bold',
        onClick && 'cursor-pointer hover:underline',
        secondary && 'text-slate-500',
        textAlign === 'left' && 'text-left',
        textAlign === 'center' && 'text-center',
        size === 'lg' && 'text-xl',
        size === 'xl' && 'text-3xl',
        icon && 'items-center'
      )}
      {...(tag !== 'button' && onClick ? { onClick } : undefined)}
    >
      {TextIcon && iconOrientation === 'left' && <TextIcon className="shrink-0" />}
      {children}
      {TextIcon && iconOrientation === 'right' && <TextIcon className="shrink-0" />}
    </span>
  );
  if (hide) return null;
  if (onClick && tag !== 'span') return <button onClick={onClick}>{text}</button>;
  return text;
};

Text.displayName = 'Text';
