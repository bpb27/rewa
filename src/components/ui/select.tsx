import { cn } from '~/utils/style';
import { Icon } from '../icons';

type SelectProps = {
  className?: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  value: string;
};

export const Select = ({ className, onSelect, options, value }: SelectProps) => {
  return (
    <div className={cn('relative flex items-center', className)}>
      <select
        className="flex h-10 appearance-none items-center justify-between rounded-md border border-slate-200 bg-transparent py-2 pl-3 pr-8 text-sm"
        onChange={e => onSelect(e.target.value)}
        value={value}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon.CaretDown height={16} className="absolute right-0 -z-10" />
    </div>
  );
};
