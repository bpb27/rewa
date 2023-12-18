import { useEffect } from 'react';
import { useDebounce } from '~/utils/use-debounce';
import { Crate } from './box';

type InputProps<TField extends string> = {
  label?: string;
  name: TField;
  onChange: (params: { name: TField; value: string }) => void;
  onDebounce?: (params: { name: TField; value: string }) => void;
  value?: string;
};

// TODO: make range - two inputs with one label
// label for revenue and budget should indicate 1k increments

export const Input = <TField extends string>({
  label,
  name,
  onChange,
  onDebounce,
  value = '',
}: InputProps<TField>) => {
  const debouncedValue = useDebounce(value, 800);

  useEffect(() => {
    onDebounce?.({ name, value: debouncedValue });
  }, [onDebounce, debouncedValue, name]);

  return (
    <Crate column>
      {label && (
        <label htmlFor={name} className="font-semibold">
          {label}
        </label>
      )}
      <input
        className="w-[100px] rounded-sm border-2 border-black p-1"
        name={name}
        onChange={e => onChange({ name, value: e.target.value })}
        value={value}
      />
    </Crate>
  );
};
