import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { DialogOverlay } from '~/components/ui/dialog';
import { Icon } from '~/components/ui/icons';
import { Token } from '~/data/tokens';
import { titleCase } from '~/utils/format';
import { cn } from '~/utils/style';
import { useAPI } from '~/utils/use-api';
import { useToggle } from '~/utils/use-toggle';
import { Checkbox } from './ui/checkbox';

// TODO: all real cats checkbox
// TODO: year selection

type MovieFiltersDialogProps = {
  oscarsCategoriesNom: number[];
  oscarsCategoriesWon: number[];
  toggleToken: (token: Omit<Token, 'name'>) => void;
};

export const MovieFiltersDialog = ({
  oscarsCategoriesNom,
  oscarsCategoriesWon,
  toggleToken,
}: MovieFiltersDialogProps) => {
  const [filterCategories, setFilterCategories] = useState(true);
  const [container, setContainer] = useState<HTMLSpanElement | null>(null);
  const dialog = useToggle('closed', 'open');
  const { data } = useAPI('/api/oscars/categories');
  const categories = (data || []).filter(c => (filterCategories ? c.relevance === 'high' : true));
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
        <div>
          <label className="font-semibold">Nominated/Won Oscars</label>
          {categories.map(({ id, name }) => (
            <span key={id} className="my-1 flex">
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
            </span>
          ))}
          <Button
            variant="card"
            onClick={() => setFilterCategories(!filterCategories)}
            className="mt-2"
          >
            {filterCategories ? 'More' : 'Fewer'} categories...
          </Button>
        </div>
      </DialogOverlay>
    </span>
  );
};
