import { Root as CheckboxRoot, Indicator as CheckboxIndicator } from '@radix-ui/react-checkbox';
import { Icon } from './icons';
import { cn } from '~/utils/style';

type CheckboxProps = {
  className?: string;
  id: number;
  label: string;
  checked: boolean;
  onCheck: (checked: boolean) => void;
};

// TODO: is id htmlfor right?
export const Checkbox = ({ checked, className, id, label, onCheck }: CheckboxProps) => (
  <div className="flex items-center">
    <CheckboxRoot
      checked={checked}
      className={cn(
        'flex h-5 w-5 appearance-none items-center justify-center rounded-sm border-2 border-slate-400 bg-white shadow-md outline-none focus:shadow-[0_0_0_2px_black]',
        className
      )}
      id={id.toString()}
      onCheckedChange={onCheck}
    >
      <CheckboxIndicator>
        <Icon.Check className="p-1" />
      </CheckboxIndicator>
    </CheckboxRoot>
    <label className="pl-3 leading-none" htmlFor={id.toString()}>
      {label}
    </label>
  </div>
);
