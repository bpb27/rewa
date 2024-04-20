import { PropsWithChildren } from 'react';
import { cn } from '~/utils/style';
import { Icon } from './icons';

type TextProps = PropsWithChildren<{
  bold?: boolean;
  className?: string;
  ellipsis?: boolean;
  hide?: boolean;
  icon?: keyof typeof Icon;
  iconOrientation?: 'left' | 'right';
  noWrap?: boolean;
  flex?: boolean;
  onClick?: () => void;
  secondary?: boolean;
  size?: 'md' | 'lg' | 'xl';
  tag?: 'span' | 'button';
  textAlign?: 'left' | 'center';
}>;

export const Text = ({
  bold,
  children,
  className,
  ellipsis,
  flex = true,
  hide,
  icon,
  iconOrientation = 'left',
  noWrap,
  onClick,
  secondary,
  size,
  tag = 'span',
  textAlign = 'left',
}: TextProps) => {
  const TextIcon = icon && icon in Icon ? Icon[icon] : null;
  const text = (
    <span
      className={cn(
        'select-text',
        flex && 'flex gap-x-2',
        noWrap && 'whitespace-nowrap',
        bold && 'font-bold',
        onClick && 'cursor-pointer hover:underline',
        secondary && 'text-slate-500',
        textAlign === 'left' && 'text-left',
        textAlign === 'center' && 'text-center',
        size === 'lg' && 'text-xl',
        size === 'xl' && 'text-2xl',
        icon && 'items-center',
        ellipsis && 'overflow-ellipsis',
        className
      )}
      {...(tag !== 'button' && onClick ? { onClick } : undefined)}
    >
      {TextIcon && iconOrientation === 'left' && <TextIcon className="shrink-0" />}
      {children}
      {TextIcon && iconOrientation === 'right' && <TextIcon className="shrink-0" />}
    </span>
  );
  if (hide) return null;
  if (onClick && tag !== 'span')
    return (
      <button className="select-text" onClick={onClick}>
        {text}
      </button>
    );
  return text;
};

Text.displayName = 'Text';
