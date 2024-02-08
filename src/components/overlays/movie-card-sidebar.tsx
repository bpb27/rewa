import { ImdbLink, SpotifyLink } from '~/components/external-links';
import { Sidebar } from '~/components/ui/sidebar';
import { trpc } from '~/trpc/client';
import { formatDate } from '~/utils/format';
import { useMovieMode } from '~/utils/use-movie-mode';
import { Crate } from '../ui/box';
import { Spotlight } from '../ui/spotlight';
import { Text } from '../ui/text';

type MovieCardSidebar = {
  actorId?: number;
  movieId: number;
  onClose: () => void;
};

export const MovieCardSidebar = ({ actorId, movieId, onClose }: MovieCardSidebar) => {
  const movieMode = useMovieMode();
  const { data: movie } = trpc.getMovie.useQuery({ id: movieId });
  const { data: actor } = trpc.getPerson.useQuery(
    { id: actorId!, filter: movieMode, field: 'actor' },
    { enabled: !!actorId }
  );
  const role = actor?.movies.find(m => m.id === movieId)?.character;

  if (!movie) return null;
  return (
    <Sidebar>
      <Sidebar.CloseButton onClose={onClose} />
      <Crate my={3}>
        <Spotlight
          description={movie.overview}
          image={movie.poster_path}
          name={movie.title}
          tagline={movie.tagline}
        />
      </Crate>
      <Crate mb={5} column gap={2}>
        {role && (
          <Crate column>
            <Text bold icon="Star">
              Role
            </Text>
            <Text>{role}</Text>
          </Crate>
        )}
        {movieMode === 'rewa' && movie.episode && (
          <Crate column>
            <Text bold icon="Mic">
              Hosts
            </Text>
            <Text>{movie.hosts.map(h => h.name).join(', ')}</Text>
          </Crate>
        )}
        <Crate column>
          <Text bold icon="Actor">
            Cast
          </Text>
          <Text>{movie.actors.map(a => a.name).join(', ')}</Text>
        </Crate>
        <Crate column>
          <Text bold icon="Video">
            Director
          </Text>
          <Text>{movie.directors.map(a => a.name).join(', ')}</Text>
        </Crate>
        {movie.oscars.noms > 0 && (
          <Crate column>
            <Text bold icon="Trophy">
              Oscars
            </Text>
            <Text>
              {movie.oscars.noms} noms, {movie.oscars.wins} wins
            </Text>
          </Crate>
        )}
        <Crate column>
          <Text bold icon="Clock">
            Release Date
          </Text>
          <Text>{formatDate(movie.release_date)}</Text>
        </Crate>
        <Crate column>
          <Text bold icon="Link">
            External Links
          </Text>
          <Crate gap={1}>
            <ImdbLink id={movie.imdb_id} className="hover:underline">
              IMDB{movie.episode ? ',' : ''}
            </ImdbLink>
            {movie.episode && (
              <SpotifyLink url={movie.episode.spotify_url} className="hover:underline">
                Spotify
              </SpotifyLink>
            )}
          </Crate>
        </Crate>
      </Crate>
    </Sidebar>
  );
};
