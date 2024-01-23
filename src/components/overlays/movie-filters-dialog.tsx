import { useCallback, useEffect, useReducer, useState } from 'react';
import { Button } from '~/components/ui/button';
import { DialogOverlay } from '~/components/ui/dialog';
import { Icon } from '~/components/ui/icons';
import { Token } from '~/data/tokens';
import { trpc } from '~/trpc/client';
import { titleCase } from '~/utils/format';
import { keys } from '~/utils/object';
import { cn } from '~/utils/style';
import { useToggle } from '~/utils/use-toggle';
import { isYear } from '~/utils/validate';
import { Crate } from '../ui/box';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';

type MovieFiltersDialogProps = {
  ranges: InitialState;
  oscarsCategoriesNom: number[];
  oscarsCategoriesWon: number[];
  clearTokenType: (tokenType: Token['type']) => void;
  replaceToken: (token: Omit<Token, 'name'>) => void;
  toggleToken: (token: Omit<Token, 'name'>) => void;
};

type InitialState = typeof initialState;
const initialState = {
  budgetGte: '',
  budgetLte: '',
  revenueGte: '',
  revenueLte: '',
  runtimeGte: '',
  runtimeLte: '',
  yearGte: '',
  yearLte: '',
} satisfies Partial<Record<Token['type'], string>>;

type EventParams = { name: keyof InitialState; value: string };

const reducer = (
  state: InitialState,
  action: ({ type: 'UPDATE' } & EventParams) | { type: 'RESET' }
): InitialState => {
  if (action.type === 'RESET') return initialState;
  if (action.type === 'UPDATE') return { ...state, [action.name]: action.value };
  return state;
};

export const MovieFiltersDialog = ({
  ranges,
  oscarsCategoriesNom,
  oscarsCategoriesWon,
  clearTokenType,
  replaceToken,
  toggleToken,
}: MovieFiltersDialogProps) => {
  const dialog = useToggle('closed', 'open');
  const [state, send] = useReducer(reducer, initialState);
  const [filterCategories, setFilterCategories] = useState(true);
  const [container, setContainer] = useState<HTMLSpanElement | null>(null);

  const { data } = trpc.getOscarCategories.useQuery();
  const categories = (data || []).filter(c => (filterCategories ? c.relevance === 'high' : true));

  const handleChange = useCallback(
    (params: EventParams) => {
      send({ type: 'UPDATE', ...params });
    },
    [send]
  );

  const handleDebounce = useCallback(
    ({ name, value }: EventParams) => {
      if (value == '') {
        clearTokenType(name);
      } else {
        if (name.includes('year') && !isYear(value)) return;
        replaceToken({ type: name, id: Number(value) });
      }
    },
    [clearTokenType, replaceToken]
  );

  useEffect(() => {
    keys(ranges).forEach(name => {
      send({ type: 'UPDATE', name, value: ranges[name] });
    });
  }, [ranges]);

  const rangeProps = { onChange: handleChange, onDebounce: handleDebounce };

  return (
    <span ref={setContainer}>
      <Button
        className={cn(dialog.isOpen && 'pointer-events-none')}
        onClick={dialog.setOpen}
        variant="icon"
      >
        <Icon.FilterSlider />
      </Button>
      <DialogOverlay
        container={container}
        isOpen={dialog.isOpen}
        onClose={dialog.setClosed}
        className="rounded-md border-2 border-slate-500 bg-white p-4 shadow-xl"
      >
        <Crate column gap={2}>
          <Crate column>
            <label className="font-semibold">Nominated | Won Oscars</label>
            {categories.map(({ id, name }) => (
              <Crate key={id} my={1}>
                <Checkbox
                  checked={oscarsCategoriesNom.includes(id)}
                  id={id}
                  label=""
                  onCheck={() => toggleToken({ type: 'oscarsCategoriesNom', id })}
                />
                <Checkbox
                  checked={oscarsCategoriesWon.includes(id)}
                  id={id}
                  label={titleCase(name)}
                  onCheck={() => toggleToken({ type: 'oscarsCategoriesWon', id })}
                />
              </Crate>
            ))}
            <Button
              variant="card"
              onClick={() => setFilterCategories(!filterCategories)}
              className="mt-2"
            >
              {filterCategories ? 'More' : 'Fewer'} categories...
            </Button>
          </Crate>
          <Crate column>
            <label className="font-semibold">Year</label>
            <Crate gap={2} alignCenter>
              <Input name="yearGte" value={state.yearGte} {...rangeProps} />
              <span>-</span>
              <Input name="yearLte" value={state.yearLte} {...rangeProps} />
            </Crate>
          </Crate>
          <Crate column>
            <label className="font-semibold">Box Office</label>
            <Crate gap={2} alignCenter>
              <Input name="revenueGte" value={state.revenueGte} {...rangeProps} />
              <span>-</span>
              <Input name="revenueLte" value={state.revenueLte} {...rangeProps} />
            </Crate>
          </Crate>
          <Crate column>
            <label className="font-semibold">Budget</label>
            <Crate gap={2} alignCenter>
              <Input name="budgetGte" value={state.budgetGte} {...rangeProps} />
              <span>-</span>
              <Input name="budgetLte" value={state.budgetLte} {...rangeProps} />
            </Crate>
          </Crate>
          <Crate column>
            <label className="font-semibold">Runtime</label>
            <Crate gap={2} alignCenter>
              <Input name="runtimeGte" value={state.runtimeGte} {...rangeProps} />
              <span>-</span>
              <Input name="runtimeLte" value={state.runtimeLte} {...rangeProps} />
            </Crate>
          </Crate>
        </Crate>
      </DialogOverlay>
    </span>
  );
};
