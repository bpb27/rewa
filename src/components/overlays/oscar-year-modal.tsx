import { useRef, useState } from 'react';
import { groupBy } from 'remeda';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icons';
import { Text } from '~/components/ui/text';
import { trpc } from '~/trpc/client';
import { titleCase } from '~/utils/format';
import { smartSort } from '~/utils/sorting';
import { cn } from '~/utils/style';
import { Crate } from '../ui/box';
import { Sidebar } from '../ui/sidebar';

/*
 this would be better as a dedicated page and table
*/

type OscarYearModalProps = {
  movieId: number;
  onClose: () => void;
  year: number;
};

export const OscarYearModal = ({ movieId, onClose, year }: OscarYearModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [limitAwards, setLimitAwards] = useState(true);
  const [selectedYear, setYear] = useState(year);
  const { data = [] } = trpc.getOscarsByYear.useQuery({ year: selectedYear });
  const movieSpotlight = data.filter(a => a.movieId === movieId);
  return (
    <Sidebar onClose={onClose}>
      <div className="my-4 flex items-center justify-between" ref={containerRef}>
        <Button
          disabled={selectedYear <= 1928}
          onClick={() => setYear(selectedYear - 1)}
          variant="icon"
        >
          <Icon.ArrowLeft />
        </Button>
        <Text size="xl" bold>
          The {selectedYear} Oscars
        </Text>
        <Button
          disabled={selectedYear >= 2024}
          onClick={() => setYear(selectedYear + 1)}
          variant="icon"
        >
          <Icon.ArrowRight />
        </Button>
      </div>
      <div>
        {movieSpotlight.length > 0 && (
          <AwardCategory
            key={movieSpotlight[0].id}
            name={movieSpotlight[0].title.toUpperCase()}
            items={movieSpotlight.map(a => ({
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
                movie: a.title,
                recipient: a.recipient,
                won: a.won,
              }))}
            />
          ))}
        <Button
          className="w-full"
          variant="card"
          onClick={() => {
            setLimitAwards(l => !l);
            containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          Show {limitAwards ? 'more' : 'fewer'}
        </Button>
      </div>
    </Sidebar>
  );
};

type AwardCategoryProps = {
  items: { movie: string; recipient: string; won: number | boolean }[];
  key: number | string;
  name: string;
};

const AwardCategory = ({ items, key, name }: AwardCategoryProps) => (
  <div key={key} className="my-4 rounded-md border-2 border-slate-300 bg-white p-4 shadow-lg">
    <h3 className="border-b-4 border-yellow-400 text-xl font-bold">{titleCase(name)}</h3>
    {items.map(({ movie, recipient, won }) => (
      <div
        key={movie + recipient}
        className={cn('my-1 flex items-center justify-between space-x-2')}
      >
        <Crate column>
          <Text bold>{movie}</Text>
          <Text>{recipient}</Text>
        </Crate>
        {!!won && <Icon.Trophy className="flex-shrink-0" />}
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
