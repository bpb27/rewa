import { ImdbLink, SpotifyLink } from '~/components/external-links';
import { Sidebar } from '~/components/ui/sidebar';
import { defaultQps } from '~/data/query-params';
import { trpc } from '~/trpc/client';
import { formatDate, titleCase } from '~/utils/format';
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
  const { data: actor } = trpc.getPerson.useQuery(
    { id: actorId!, field: 'actor', subField: 'mostFilms', params: defaultQps },
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
            <Text
              tag="button"
              icon={awards.isShowing ? 'CaretUp' : 'CaretDown'}
              onClick={awards.toggle}
              iconOrientation="right"
            >
              {movie.oscars.noms} noms, {movie.oscars.wins} wins
            </Text>
            {awards.isShowing && (
              <Crate my={2} px={2} column className="border-l-2 border-l-slate-600">
                {smartSort(movie.oscars.awards, a => a.awardCategory).map(a => (
                  <Text key={a.awardCategoryId + a.recipient}>
                    {titleCase(a.awardCategory)} {a.won && '- Winner'}
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
