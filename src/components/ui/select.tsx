import { Icon } from '~/components/ui/icons';
import { cn } from '~/utils/style';

type SelectProps<TValue extends string = string> = {
  className?: string;
  options: { label: string; value: TValue }[];
  onSelect: (value: TValue) => void;
  value: string;
};

export const Select = <TValue extends string = string>({
  className,
  onSelect,
  options,
  value,
}: SelectProps<TValue>) => {
  return (
    <div className={cn('relative flex items-center', className)}>
      <select
        className="flex h-10 appearance-none items-center justify-between rounded-md border border-slate-200 bg-transparent py-2 pl-3 pr-8 text-sm"
        onChange={e => onSelect(e.target.value as (typeof options)[number]['value'])}
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
