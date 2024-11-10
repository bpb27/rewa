import { useEffect, useState } from 'react';
import { trpc } from '~/trpc/client';
import { ApiResponses } from '~/trpc/router';
import { moneyShort } from '~/utils/format';
import { SidebarActions } from '~/utils/use-sidebar';
import { PersonPoster } from '../images';
import { Crate } from '../ui/box';
import { Button } from '../ui/button';
import { Icon } from '../ui/icons';
import { Select } from '../ui/select';
import { Sidebar } from '../ui/sidebar';
import { Text } from '../ui/text';

type PopularMoviesByYearProps = {
  year: number;
} & SidebarActions;

type Movie = ApiResponses['getMoviesFromTmdb'][number];

export const PopularMoviesByYear = ({ year, ...sidebarProps }: PopularMoviesByYearProps) => {
  const [sortBy, setSort] = useState<'vote_count' | 'revenue'>('revenue');
  const [selectedYear, setYear] = useState(year);
  const movies = trpc.getMoviesFromTmdb.useQuery({ sortBy, year: selectedYear });

  useEffect(() => setYear(year), [year]);

  return (
    <Sidebar {...sidebarProps} title={`Top movies ${selectedYear}`}>
      <div className="flex items-center justify-between">
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
      <Crate>
        <Select
          className="w-full"
          onSelect={value => setSort(value)}
          options={[
            { label: 'Box office', value: 'revenue' },
            { label: 'TMDB Votes', value: 'vote_count' },
          ]}
          value={sortBy}
        />
      </Crate>
      <Crate column>
        {(movies.data || []).map(movie => (
          <Movie key={movie.tmdbId} {...movie} />
        ))}
      </Crate>
    </Sidebar>
  );
};

const Movie = ({ name, overview, image, revenue }: Movie) => {
  const [showPlot, setShowPlot] = useState(false);
  return (
    <Crate column>
      <Crate alignCenter gap={2} my={1}>
        <PersonPoster image={image} name={name} variant="table" />
        <Crate column>
          <Text bold>{name}</Text>
          {!!revenue && <Text>{moneyShort(Number(revenue))}</Text>}
          <Text secondary onClick={() => setShowPlot(!showPlot)}>
            Show plot
          </Text>
        </Crate>
      </Crate>
      {showPlot && (
        <Crate className="rounded-md border-2 border-slate-400 p-1">
          <Text>{overview}</Text>
        </Crate>
      )}
    </Crate>
  );
};
