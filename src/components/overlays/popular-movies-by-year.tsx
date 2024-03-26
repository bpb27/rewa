import { useState } from 'react';
import { trpc } from '~/trpc/client';
import { PersonPoster } from '../images';
import { Crate } from '../ui/box';
import { Radio } from '../ui/radio';
import { Sidebar } from '../ui/sidebar';
import { Text } from '../ui/text';

type PopularMoviesByYearProps = {
  year: string;
  onClose: () => void;
};

export const PopularMoviesByYear = ({ onClose, year }: PopularMoviesByYearProps) => {
  const [sortBy, setSort] = useState<'vote_count' | 'revenue'>('vote_count');
  const movies = trpc.getMoviesFromTmdb.useQuery({ sortBy, year });
  return (
    <Sidebar onClose={onClose} thin>
      <Radio label="Order" id="popularityOrder">
        <Radio.Item
          checked={sortBy === 'vote_count'}
          label="TMDB votes"
          value="vote_count"
          onClick={() => setSort('vote_count')}
        />
        <Radio.Item
          checked={sortBy === 'revenue'}
          label="Revenue"
          value="revenue"
          onClick={() => setSort('revenue')}
        />
      </Radio>
      <Crate column>
        {(movies.data || []).map(movie => (
          <Crate key={movie.tmdbId} alignCenter gap={2} my={1}>
            <PersonPoster {...movie} variant="table" />
            <Movie {...movie} />
          </Crate>
        ))}
      </Crate>
    </Sidebar>
  );
};

const Movie = ({ name, overview }: { name: string; overview: string }) => {
  // const [showDesc, setShowDesc] = useState(false);
  return (
    <Crate column>
      <Text bold>{name}</Text>
      {/* <Text
        secondary
        icon={showDesc ? 'CaretUp' : 'CaretDown'}
        iconOrientation="right"
        onClick={() => setShowDesc(!showDesc)}
      >
        Show plot
      </Text>
      {showDesc && <Text>{overview}</Text>} */}
    </Crate>
  );
};
