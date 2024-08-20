import { useCallback, useEffect, useReducer, useState } from 'react';
import { Button } from '~/components/ui/button';
import { DialogOverlay } from '~/components/ui/dialog';
import { Icon } from '~/components/ui/icons';
import { trpc } from '~/trpc/client';
import { AppEnums } from '~/utils/enums';
import { titleCase } from '~/utils/format';
import { keys } from '~/utils/object';
import { cn } from '~/utils/style';
import { useToggle } from '~/utils/use-toggle';
import { isYear } from '~/utils/validate';
import { Crate } from '../ui/box';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Table } from '../ui/table';

type MovieFiltersDialogProps = {
  ranges: InitialState;
  oscarsCategoriesNom: number[];
  oscarsCategoriesWon: number[];
  clearTokenType: (tokenType: AppEnums['token']) => void;
  replaceToken: (tokenType: AppEnums['token'], id: number) => void;
  toggleToken: (tokenType: AppEnums['token'], id: number) => void;
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
} satisfies Partial<Record<AppEnums['token'], string>>;

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
        replaceToken(name, Number(value));
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
        <Table>
          <Table.Head className="bg-lime-100">
            <Table.Header>Nom</Table.Header>
            <Table.Header>Won</Table.Header>
            <Table.Header>Award</Table.Header>
          </Table.Head>
          <Table.Body>
            <Table.Row margin={3} className="border-0" />
            {categories.map(c => (
              <Table.Row key={c.id} margin={3} className="border-0 bg-white p-2">
                <Table.Data>
                  <Checkbox
                    checked={oscarsCategoriesNom.includes(c.id)}
                    id={c.id}
                    label=""
                    onCheck={() => toggleToken('oscarsCategoriesNom', c.id)}
                    className="mb-2"
                  />
                </Table.Data>
                <Table.Data>
                  <Checkbox
                    checked={oscarsCategoriesWon.includes(c.id)}
                    id={c.id}
                    label=""
                    onCheck={() => toggleToken('oscarsCategoriesWon', c.id)}
                    className="mb-2"
                  />
                </Table.Data>
                <Table.Data className="flex">{titleCase(c.name)}</Table.Data>
              </Table.Row>
            ))}
            <Table.Data></Table.Data>
          </Table.Body>
        </Table>
        <Crate column gap={2}>
          <Crate column>
            <Button
              variant="card"
              onClick={() => setFilterCategories(!filterCategories)}
              className="mb-2"
            >
              {filterCategories ? 'More' : 'Fewer'} categories...
            </Button>
            <label>Year</label>
            <Crate gap={2} alignCenter>
              <Input name="yearGte" value={state.yearGte} {...rangeProps} />
              <span>-</span>
              <Input name="yearLte" value={state.yearLte} {...rangeProps} />
            </Crate>
          </Crate>
          <Crate column>
            <label>Box Office</label>
            <Crate gap={2} alignCenter>
              <Input name="revenueGte" value={state.revenueGte} {...rangeProps} />
              <span>-</span>
              <Input name="revenueLte" value={state.revenueLte} {...rangeProps} />
            </Crate>
          </Crate>
          <Crate column>
            <label>Budget</label>
            <Crate gap={2} alignCenter>
              <Input name="budgetGte" value={state.budgetGte} {...rangeProps} />
              <span>-</span>
              <Input name="budgetLte" value={state.budgetLte} {...rangeProps} />
            </Crate>
          </Crate>
          <Crate column>
            <label>Runtime</label>
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
