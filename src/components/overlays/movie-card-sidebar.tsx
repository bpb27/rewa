import { ComponentProps, PropsWithChildren } from 'react';
import { ImdbLink, SpotifyLink } from '~/components/external-links';
import { Sidebar } from '~/components/ui/sidebar';
import { trpc } from '~/trpc/client';
import { newFormatDate, titleCase } from '~/utils/format';
import { smartSort } from '~/utils/sorting';
import { useMovieMode } from '~/utils/use-movie-mode';
import { SidebarActions } from '~/utils/use-sidebar';
import { useToggle } from '~/utils/use-toggle';
import { Crate } from '../ui/box';
import { Spotlight } from '../ui/spotlight';
import { Text } from '../ui/text';

type MovieCardSidebar = {
  actorId?: number;
  movieId: number;
} & SidebarActions;

export const MovieCardSidebar = ({ actorId, movieId, ...sidebarProps }: MovieCardSidebar) => {
  const movieMode = useMovieMode();
  const awards = useToggle('hiding', 'showing');
  const { data: movie } = trpc.getMovie.useQuery({ id: movieId });
  const { data: actor } = trpc.getActorRole.useQuery(
    { actorId: actorId!, movieId },
    { enabled: !!actorId }
  );

  if (!movie) return null;
  return (
    <Sidebar {...sidebarProps}>
      <Crate my={3}>
        <Spotlight {...movie} />
      </Crate>
      <Crate mb={5} column gap={3}>
        {actor && (
          <Crate column>
            <Header icon="Star">Role</Header>
            <Text>{actor.character}</Text>
          </Crate>
        )}
        {movieMode === 'rewa' && movie.episode && (
          <Crate column>
            <Header icon="Mic">Hosts</Header>
            <Text>{movie.episode.hosts.map(h => h.name).join(', ')}</Text>
          </Crate>
        )}
        <Crate column>
          <Header icon="Actor">Cast</Header>
          <Text>{movie.actors.map(a => a.name).join(', ')}</Text>
        </Crate>
        <Crate column>
          <Header icon="Video">Director</Header>
          <Text>
            {movie.crew
              .filter(c => c.job === 'director')
              .map(a => a.name)
              .join(', ')}
          </Text>
        </Crate>
        {movie.totalOscarNominations > 0 && (
          <Crate column>
            <Header icon="Trophy">Oscars</Header>
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
          <Header icon="Clock">Release Date</Header>
          <Text>{newFormatDate(movie.releaseDate, 'slash')}</Text>
        </Crate>
        <Crate column>
          <Header icon="Link">External Links</Header>
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

const Header = ({
  children,
  icon,
}: PropsWithChildren<{ icon: ComponentProps<typeof Text>['icon'] }>) => {
  return (
    <Text bold icon={icon} className="mb-2 ">
      {children}
    </Text>
  );
};
