import { Token } from '~/data/tokens';
import { trpc } from '~/trpc/client';
import { useMovieMode } from '~/utils/use-movie-mode';
import { SidebarActions } from '~/utils/use-sidebar';
import { PersonPoster } from '../images';
import { Crate } from '../ui/box';
import { Icon } from '../ui/icons';
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
  // TODO: sort option - credit order, name, total movies
  return (
    <Sidebar thin {...sidebarProps}>
      <Crate column>
        {(cast.data || []).map(actor => (
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
