import { useState } from 'react';
import { Token } from '~/data/tokens';
import { trpc } from '~/trpc/client';
import { useMovieMode } from '~/utils/use-movie-mode';
import { SidebarActions } from '~/utils/use-sidebar';
import { PersonPoster } from '../images';
import { Crate } from '../ui/box';
import { Icon } from '../ui/icons';
import { Select } from '../ui/select';
import { Sidebar } from '../ui/sidebar';
import { Text } from '../ui/text';

type MovieCastSidebarProps = {
  movieId: number;
  onTokenClick: (tokenType: Token['type'], id: number) => void;
} & SidebarActions;

export const MovieCastSidebar = ({
  movieId,
  onTokenClick,
  ...sidebarProps
}: MovieCastSidebarProps) => {
  const movieMode = useMovieMode();
  const cast = trpc.getMovieCast.useQuery({ movieId, movieMode });
  const [sortBy, setSortBy] = useState<'credit' | 'name' | 'total'>('credit');
  return (
    <Sidebar thin {...sidebarProps} title="Movie cast">
      <Select
        options={[
          { label: 'Credit order', value: 'credit' },
          { label: 'Name', value: 'name' },
          { label: 'Total', value: 'total' },
        ]}
        onSelect={setSortBy}
        value={sortBy}
      />
      <Crate column>
        {(cast.data || [])
          .sort((a, b) => {
            if (sortBy === 'credit') return a.creditOrder - b.creditOrder;
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'total') return Number(b.total) - Number(a.total);
            return 0;
          })
          .map(actor => (
            <Crate key={actor.id} alignCenter gap={2} my={1}>
              <PersonPoster {...actor} variant="table" />
              <Crate column>
                <Text bold onClick={() => onTokenClick('actor', actor.id)}>
                  {actor.name}
                </Text>
                <Text>{actor.role}</Text>
                <Text secondary>
                  <Icon.FilmStrip /> {actor.total}
                </Text>
              </Crate>
            </Crate>
          ))}
      </Crate>
    </Sidebar>
  );
};
