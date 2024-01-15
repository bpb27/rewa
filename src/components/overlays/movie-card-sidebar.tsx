import { ImdbLink, SpotifyLink } from '~/components/external-links';
import { Sidebar } from '~/components/ui/sidebar';
import { trpc } from '~/trpc/client';
import { formatDate } from '~/utils/format';
import { useMovieMode } from '~/utils/use-movie-mode';
import { Crate } from '../ui/box';
import { Text } from '../ui/text';

type MovieCardSidebar = {
  actorId?: number;
  movieId: number;
  onClose: () => void;
};

export const MovieCardSidebar = ({ actorId, movieId, onClose }: MovieCardSidebar) => {
  const movieMode = useMovieMode();
  const { data: movie } = trpc.getMovie.useQuery({ id: movieId });
  const { data: actor } = trpc.getActor.useQuery({ id: actorId! }, { enabled: !!actorId });
  const role = actor?.movies.find(m => m.movieId === movieId)?.character;

  if (!movie) return null;
  return (
    <Sidebar>
      <Sidebar.CloseButton onClose={onClose} />
      <Sidebar.HeaderAndPoster {...movie} header={movie.title} />
      <Crate mb={5} mt={3} gap={2} column alignCenter>
        {movie.tagline && (
          <Text secondary textAlign="center">
            {movie.tagline}
          </Text>
        )}
        {role && (
          <Sidebar.StarBar>
            <Text bold>{role}</Text>
          </Sidebar.StarBar>
        )}
        <Text>{movie.overview}</Text>
      </Crate>
      <Crate mb={5} column>
        {movieMode === 'rewa' && movie.episode && (
          <>
            {movie.hosts.map(({ id, name }) => (
              <Text icon="Mic" key={id}>
                {name}
              </Text>
            ))}
            <Sidebar.Separator />
          </>
        )}
        {movie.directors.map(({ id, name }) => (
          <Text icon="Video" key={id}>
            {name}
          </Text>
        ))}
        {movie.actors.map(({ id, name }) => (
          <Text icon="Star" key={id}>
            {name}
          </Text>
        ))}
        {movie.streamers.length > 0 && (
          <>
            <Sidebar.Separator />
            {movie.streamers.map(({ id, name }) => (
              <Text icon="Tv" key={id}>
                {name}
              </Text>
            ))}
          </>
        )}
        <Sidebar.Separator />
        <Text icon="Calendar">{formatDate(movie.release_date)}</Text>
        <Text icon="Clock">{movie.runtime.name}</Text>
        <Text icon="Dollar">
          {movie.budget.name} / {movie.revenue.name}
        </Text>
        <Sidebar.Separator />
        <Text icon="Link">
          <ImdbLink id={movie.imdb_id} className="mx-1 hover:underline">
            IMDB
          </ImdbLink>
        </Text>
        {movie.episode && (
          <Text icon="Link">
            <SpotifyLink url={movie.episode.spotify_url} className="mx-1 hover:underline">
              Spotify
            </SpotifyLink>
          </Text>
        )}
      </Crate>
    </Sidebar>
  );
};
