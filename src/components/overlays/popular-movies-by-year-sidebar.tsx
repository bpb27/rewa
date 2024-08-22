import { useState } from 'react';
import { trpc } from '~/trpc/client';
import { ApiResponses } from '~/trpc/router';
import { moneyShort } from '~/utils/format';
import { SidebarActions } from '~/utils/use-sidebar';
import { PersonPoster } from '../images';
import { Crate } from '../ui/box';
import { Select } from '../ui/select';
import { Sidebar } from '../ui/sidebar';
import { Text } from '../ui/text';

type PopularMoviesByYearProps = {
  year: string;
} & SidebarActions;

type Movie = ApiResponses['getMoviesFromTmdb'][number];

export const PopularMoviesByYear = ({ year, ...sidebarProps }: PopularMoviesByYearProps) => {
  const [sortBy, setSort] = useState<'vote_count' | 'revenue'>('revenue');
  const movies = trpc.getMoviesFromTmdb.useQuery({ sortBy, year });
  return (
    <Sidebar thin {...sidebarProps}>
      <Crate>
        <Select
          className="w-full border-2 border-slate-300"
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
        <Crate className="rounded-md border-2 border-slate-400 bg-slate-50 p-1">
          <Text>{overview}</Text>
        </Crate>
      )}
    </Crate>
  );
};
