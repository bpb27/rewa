import { ImdbLink, SpotifyLink } from '~/components/external-links';
import { Sidebar } from '~/components/ui/sidebar';
import { trpc } from '~/trpc/client';
import { newFormatDate, titleCase } from '~/utils/format';
import { smartSort } from '~/utils/sorting';
import { useMovieMode } from '~/utils/use-movie-mode';
import { useToggle } from '~/utils/use-toggle';
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
  const awards = useToggle('hiding', 'showing');
  const { data: movie } = trpc.getMovie.useQuery({ id: movieId });
  const { data: actor } = trpc.getActorRole.useQuery(
    { actorId: actorId!, movieId },
    { enabled: !!actorId }
  );

  if (!movie) return null;
  return (
    <Sidebar onClose={onClose}>
      <Crate my={3}>
        <Spotlight {...movie} />
      </Crate>
      <Crate mb={5} column gap={2}>
        {actor && (
          <Crate column>
            <Text bold icon="Star">
              Role
            </Text>
            <Text>{actor.character}</Text>
          </Crate>
        )}
        {movieMode === 'rewa' && movie.episode && (
          <Crate column>
            <Text bold icon="Mic">
              Hosts
            </Text>
            <Text>{movie.episode.hosts.map(h => h.name).join(', ')}</Text>
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
          <Text>
            {movie.crew
              .filter(c => c.job === 'director')
              .map(a => a.name)
              .join(', ')}
          </Text>
        </Crate>
        {movie.totalOscarNominations > 0 && (
          <Crate column>
            <Text bold icon="Trophy">
              Oscars
            </Text>
            <Text
              tag="button"
              icon={awards.isShowing ? 'CaretUp' : 'CaretDown'}
              onClick={awards.toggle}
              iconOrientation="right"
            >
              {movie.totalOscarNominations} noms, {movie.totalOscarWins} wins
            </Text>
            {awards.isShowing && (
              <Crate my={2} px={2} column className="border-l-2 border-l-slate-600">
                {smartSort(movie.oscars, a => a.category).map(a => (
                  <Text key={a.category + a.recipient}>
                    {titleCase(a.category)} {a.won && '- Winner'}{' '}
                    {a.category.includes('actor') && `- ${a.recipient}`}
                  </Text>
                ))}
              </Crate>
            )}
          </Crate>
        )}
        <Crate column>
          <Text bold icon="Clock">
            Release Date
          </Text>
          <Text>{newFormatDate(movie.releaseDate, 'slash')}</Text>
        </Crate>
        <Crate column>
          <Text bold icon="Link">
            External Links
          </Text>
          <Crate gap={1}>
            <ImdbLink id={movie.imdbId} className="hover:underline">
              IMDB{movie.episode ? ',' : ''}
            </ImdbLink>
            {movie.episode && (
              <SpotifyLink url={movie.episode.spotifyUrl} className="hover:underline">
                Spotify
              </SpotifyLink>
            )}
          </Crate>
        </Crate>
      </Crate>
    </Sidebar>
  );
};
