import { PropsWithChildren } from 'react';
import { cn } from '~/utils/style';
import { Crate } from './box';

export const Radio = ({
  children,
  id,
  label,
}: PropsWithChildren<{ id: string; label: string }>) => (
  <fieldset id={id}>
    <legend hidden>{label}</legend>
    {children}
  </fieldset>
);

const Item = <TValue extends string>({
  checked,
  disabled,
  label,
  mobileLabel,
  onClick,
  value,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  mobileLabel?: string;
  onClick: (value: TValue) => void;
  value: TValue;
}) => {
  const handleClick = () => !disabled && onClick(value);
  return (
    <Crate alignCenter>
      <input
        className={cn('mr-1 cursor-pointer', disabled && 'cursor-not-allowed')}
        id={value}
        type="radio"
        name={value}
        checked={checked}
        onChange={handleClick}
      />
      <label
        htmlFor={value}
        onClick={handleClick}
        className={cn('cursor-pointer', disabled && 'cursor-not-allowed text-slate-500')}
      >
        <span className="hidden sm:inline">{label}</span>
        <span className="inline sm:hidden">{mobileLabel || label}</span>
      </label>
    </Crate>
  );
};

Radio.Item = Item;
