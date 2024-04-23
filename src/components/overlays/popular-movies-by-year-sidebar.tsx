import { useState } from 'react';
import { trpc } from '~/trpc/client';
import { ApiResponses } from '~/trpc/router';
import { moneyShort } from '~/utils/format';
import { SidebarActions } from '~/utils/use-sidebar';
import { PersonPoster } from '../images';
import { Crate } from '../ui/box';
import { Radio } from '../ui/radio';
import { Sidebar } from '../ui/sidebar';
import { Text } from '../ui/text';

type PopularMoviesByYearProps = {
  year: string;
} & SidebarActions;

export const PopularMoviesByYear = ({ year, ...sidebarProps }: PopularMoviesByYearProps) => {
  const [sortBy, setSort] = useState<'vote_count' | 'revenue'>('revenue');
  const movies = trpc.getMoviesFromTmdb.useQuery({ sortBy, year });
  return (
    <Sidebar thin {...sidebarProps}>
      <Radio label="Order" id="popularityOrder">
        <Radio.Item
          checked={sortBy === 'revenue'}
          label="Box office"
          value="revenue"
          onClick={() => setSort('revenue')}
        />
        <Radio.Item
          checked={sortBy === 'vote_count'}
          label="TMDB votes"
          value="vote_count"
          onClick={() => setSort('vote_count')}
        />
      </Radio>
      <Crate column>
        {(movies.data || []).map(movie => (
          <Movie key={movie.tmdbId} {...movie} />
        ))}
      </Crate>
    </Sidebar>
  );
};

const Movie = ({ name, overview, image, revenue }: ApiResponses['getMoviesFromTmdb'][number]) => {
  const [showDesc, setShowDesc] = useState(false);
  return (
    <Crate column>
      <Crate alignCenter gap={2} my={1}>
        <PersonPoster image={image} name={name} variant="table" />
        <Crate column>
          <Text bold>{name}</Text>
          {!!revenue && <Text>{moneyShort(Number(revenue))}</Text>}
          <Text secondary onClick={() => setShowDesc(!showDesc)}>
            Show plot
          </Text>
        </Crate>
      </Crate>
      {showDesc && (
        <Crate>
          <Text>{overview}</Text>
        </Crate>
      )}
    </Crate>
  );
};
