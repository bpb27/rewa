import { useRef, useState } from 'react';
import { groupBy } from 'remeda';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icons';
import { Text } from '~/components/ui/text';
import { trpc } from '~/trpc/client';
import { titleCase } from '~/utils/format';
import { smartSort } from '~/utils/sorting';
import { cn } from '~/utils/style';
import { SidebarActions } from '~/utils/use-sidebar';
import { Crate } from '../ui/box';
import { Sidebar } from '../ui/sidebar';

/*
 this would be better as a dedicated page and table
*/

type OscarYearModalProps = {
  movieId: number;
  onMovieTitleClick: (id: number) => void;
  year: number;
} & SidebarActions;

export const OscarYearModal = ({
  movieId,
  onMovieTitleClick,
  year,
  ...sidebarProps
}: OscarYearModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [limitAwards, setLimitAwards] = useState(true);
  const [selectedYear, setYear] = useState(year);
  const { data = [] } = trpc.getOscarsByYear.useQuery({ year: selectedYear });
  const movieSpotlight = data.filter(a => a.movieId === movieId);
  return (
    <Sidebar {...sidebarProps} title={`${selectedYear} Oscars`}>
      <div className="flex items-center justify-between" ref={containerRef}>
        <Button
          className="border-2 border-slate-200 bg-transparent text-slate-200 hover:bg-slate-700"
          disabled={selectedYear <= 1928}
          onClick={() => setYear(selectedYear - 1)}
          variant="icon"
        >
          <Icon.ArrowLeft className="mr-2" />
          <span>{selectedYear - 1}</span>
        </Button>
        <Button
          className="border-2 border-slate-200 bg-transparent text-slate-200 hover:bg-slate-700"
          disabled={selectedYear >= 2024}
          onClick={() => setYear(selectedYear + 1)}
          variant="icon"
        >
          <span>{selectedYear + 1}</span>
          <Icon.ArrowRight className="ml-2" />
        </Button>
      </div>
      <div>
        {movieSpotlight.length > 0 && (
          <AwardCategory
            key={movieSpotlight[0].id}
            name={movieSpotlight[0].title.toUpperCase()}
            items={movieSpotlight.map(a => ({
              id: a.movieId,
              movie: titleCase(a.category),
              recipient: a.recipient,
              won: a.won,
            }))}
          />
        )}
      </div>
      <div>
        {Object.values(groupBy(data, item => item.award))
          .filter(group => (limitAwards ? group.every(e => e.relevance === 'high') : true))
          .map(group => (
            <AwardCategory
              key={group[0].id}
              name={titleCase(group[0].award)}
              items={smartSort(group, i => i.title).map(a => ({
                id: a.movieId,
                movie: a.title,
                recipient: a.recipient,
                won: a.won,
              }))}
              onTitleClick={onMovieTitleClick}
            />
          ))}
        <Button
          className="w-full bg-transparent"
          variant="card"
          onClick={() => {
            setLimitAwards(l => !l);
          }}
        >
          Show {limitAwards ? 'more' : 'fewer'}
        </Button>
      </div>
    </Sidebar>
  );
};

type AwardCategoryProps = {
  items: { id: number; movie: string; recipient: string; won: number | boolean }[];
  key: number | string;
  name: string;
  onTitleClick?: (id: number) => void;
};

const AwardCategory = ({ items, key, name, onTitleClick }: AwardCategoryProps) => (
  <div key={key} className="my-4 rounded-md border-2 border-slate-300 p-4 shadow-lg">
    <h3 className="border-b-4 border-yellow-400 text-xl font-bold">{titleCase(name)}</h3>
    {items.map(({ id, movie, recipient, won }) => (
      <div
        key={movie + recipient}
        className={cn(
          'my-1 flex items-center justify-between space-x-2 p-1',
          won && 'bg-slate-700'
        )}
      >
        <Crate column>
          {onTitleClick ? (
            <Text bold onClick={() => onTitleClick(id)}>
              {movie}
            </Text>
          ) : (
            <Text bold>{movie}</Text>
          )}
          <Text>{recipient}</Text>
        </Crate>
        {!!won && <Icon.Trophy className="flex-shrink-0 text-yellow-400" />}
      </div>
    ))}
  </div>
);

const showRecipient = (name: string) =>
  [
    'actor',
    'actress',
    'supporting_actress',
    'supporting_actor',
    'directing',
    'writing',
    'writing_adapted',
    'cinematography',
  ].includes(name);
