import * as Slider from '@radix-ui/react-slider';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { DialogOverlay } from '~/components/ui/dialog';
import { Icon } from '~/components/ui/icons';
import { titleCase } from '~/utils/format';
import { useAPI } from '~/utils/use-api';
import { useToggle } from '~/utils/use-toggle';
import { Checkbox } from './ui/checkbox';
import { useQueryParams } from '~/data/query-params';

type MovieFiltersDialogProps = {
  initialRange: number[];
  onSelect: (years: number[]) => void;
};

// TODO: still retains old values after clearing tokens
// TODO: clicking the filter button w/ dialog open closes (interactOutside) and reopens
export const MovieFiltersDialog = ({ initialRange, onSelect }: MovieFiltersDialogProps) => {
  const { values, update } = useQueryParams();
  const [minYear, setMinYear] = useState(values.yearRange[0] || 1945);
  const [maxYear, setMaxYear] = useState(values.yearRange[1] || new Date().getFullYear() + 1);
  const [container, setContainer] = useState<HTMLSpanElement | null>(null);
  const dialog = useToggle('closed', 'open');
  const { data: categories } = useAPI('/api/oscars/categories');
  return (
    <span ref={setContainer}>
      <Button variant="icon" onClick={dialog.toggle}>
        <Icon.FilterSlider />
      </Button>
      <DialogOverlay
        container={container}
        isOpen={dialog.isOpen}
        onClose={dialog.setClosed}
        className="rounded-md border-2 border-slate-500 bg-white p-4 shadow-xl"
      >
        <div>
          <div className="mb-3">
            <label className="font-semibold">Year range</label>
            <p>
              {minYear} - {maxYear}
            </p>
            <Slider.Root
              className="relative flex h-5 w-[200px] touch-none select-none items-center"
              min={1945}
              max={2023}
              step={1}
              value={[minYear, maxYear]}
              onValueChange={values => {
                setMinYear(values[0]);
                setMaxYear(values[1]);
              }}
              onValueCommit={years => {
                update('yearRange', years);
              }}
            >
              <Slider.Track className="relative h-[3px] grow rounded-full bg-slate-300">
                <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
              </Slider.Track>
              {['min', 'max'].map(item => (
                <Slider.Thumb
                  key={item}
                  className="block h-5 w-5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-slate-700 hover:bg-blue-300 focus:shadow-[0_0_0_5px] focus:shadow-black focus:outline-none"
                  aria-label="Year"
                />
              ))}
            </Slider.Root>
          </div>
        </div>
        <div>
          <label className="font-semibold">Nominated/Won Oscars</label>
          {(categories || [])
            .filter(c => c.relevance === 'high')
            .map(({ id, name }) => (
              <span key={id} className="my-1 flex">
                <Checkbox
                  checked={values.oscarsCategoriesNom.includes(id)}
                  id={id}
                  label=""
                  onCheck={() => update('oscarsCategoriesNom', id)}
                />
                <Checkbox
                  checked={values.oscarsCategoriesWon.includes(id)}
                  id={id}
                  label={titleCase(name)}
                  onCheck={() => update('oscarsCategoriesWon', id)}
                />
              </span>
            ))}
        </div>
      </DialogOverlay>
    </span>
  );
};
