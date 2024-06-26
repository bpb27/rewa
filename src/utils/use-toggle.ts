import { useMemo, useState } from 'react';
import { capitalize } from './format';

const cap = <TStr extends string>(str: TStr) => capitalize(str) as Capitalize<TStr>;
const isBrand = <T extends string>(str: T): `is${Capitalize<T>}` => `is${cap(str)}`;
const setBrand = <T extends string>(str: T): `set${Capitalize<T>}` => `set${cap(str)}`;

type UseToggleResponse<TField extends string> = {
  [k in `is${Capitalize<TField>}`]: boolean;
} & {
  [k in `set${Capitalize<TField>}`]: () => void;
} & {
  toggle: () => void;
  set: (value: TField) => void;
  isDefined: boolean;
};

export const useToggle = <TOne extends string, TTwo extends string>(
  firstValue: TOne,
  secondValue: TTwo,
  initialValue?: null
) => {
  const [value, setValue] = useState<TOne | TTwo | undefined>(
    initialValue === null ? undefined : firstValue
  );

  const staticResponse = useMemo(
    () => ({
      [setBrand(firstValue)]: () => setValue(firstValue),
      [setBrand(secondValue)]: () => setValue(secondValue),
      toggle: () => setValue(v => (v === firstValue ? secondValue : firstValue)),
      set: (v: TOne | TTwo) => setValue(v),
    }),
    [firstValue, secondValue, setValue]
  );

  const response = {
    [isBrand(firstValue)]: value === firstValue,
    [isBrand(secondValue)]: value === secondValue,
    isDefined: value !== undefined,
    ...staticResponse,
  } as UseToggleResponse<TOne | TTwo>;
  return response;
};
