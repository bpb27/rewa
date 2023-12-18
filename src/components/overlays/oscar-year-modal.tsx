import { useRef, useState } from 'react';
import { groupBy } from 'remeda';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icons';
import { Modal, type ModalProps } from '~/components/ui/modal';
import { Text } from '~/components/ui/text';
import { smartSort } from '~/utils/sorting';
import { cn } from '~/utils/style';
import { useAPI } from '~/utils/use-api';
import { Crate } from '../ui/box';

/*
  layout options
  - table
  - mini cards w/ poster - doesn't need to wrap
  - simple compressed big award header + one line <i>movie</i> - recip
*/

type OscarYearModalProps = { movieId: number; year: number } & ModalProps;

export const OscarYearModal = ({ movieId, year, ...modalProps }: OscarYearModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [limitAwards, setLimitAwards] = useState(true);
  const [selectedYear, setYear] = useState(year);
  const { data = [] } = useAPI(`/api/oscars/year/${selectedYear}`);
  const movieSpotlight = data.filter(a => a.movie_id === movieId);
  return (
    <Modal {...modalProps} className="p-3">
      <div className="my-8 flex items-center justify-between" ref={containerRef}>
        <Button
          disabled={selectedYear <= 1950}
          onClick={() => setYear(selectedYear - 1)}
          variant="icon"
        >
          <Icon.ArrowLeft />
        </Button>
        <Text size="xl" bold>
          The {selectedYear} Oscars
        </Text>
        <Button
          disabled={selectedYear >= 2023}
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
            name={movieSpotlight[0].movie.title.toUpperCase()}
            items={movieSpotlight.map(a => ({
              movie: a.award.name,
              recipient: a.recipient,
              won: a.won,
            }))}
          />
        )}
      </div>
      <div>
        {Object.values(groupBy(data, item => item.award.id))
          .filter(group =>
            limitAwards ? group.every(e => e.award.oscars_categories.relevance === 'high') : true
          )
          .map(group => (
            <AwardCategory
              key={group[0].id}
              name={group[0].award.name}
              items={smartSort(group, i => i.movie.title).map(a => ({
                movie: a.movie.title,
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
    </Modal>
  );
};

type AwardCategoryProps = {
  items: { movie: string; recipient: string; won: boolean }[];
  key: number | string;
  name: string;
};

const AwardCategory = ({ items, key, name }: AwardCategoryProps) => (
  <div key={key} className="my-4 rounded-md border-2 border-slate-300 bg-white p-4 shadow-lg">
    <h3 className="border-b-4 border-yellow-400 text-xl font-bold">{name}</h3>
    {items.map(({ movie, recipient, won }) => (
      <div
        key={movie + recipient}
        className={cn('my-1 flex items-center justify-between space-x-2')}
      >
        <Crate column>
          <Text bold noWrap={false}>
            {movie}
          </Text>
          <Text noWrap={false}>{recipient}</Text>
        </Crate>
        {won && <Icon.Trophy className="flex-shrink-0" />}
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
