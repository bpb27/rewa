import { Sidebar } from '~/components/ui/sidebar';
import { trpc } from '~/trpc/client';
import { bookends } from '~/utils/object';
import { useMovieMode } from '~/utils/use-movie-mode';
import { PersonPoster, TheaterBackground } from '../images';
import { Crate } from '../ui/box';
import { Text } from '../ui/text';

type ActorCardSidebar = {
  actorId: number;
  onClose: () => void;
  onSelectMovie: (movieId: number) => void;
};

export const ActorCardSidebar = ({ actorId, onClose, onSelectMovie }: ActorCardSidebar) => {
  const filter = useMovieMode();
  const { data: actor } = trpc.getActor.useQuery({ filter, id: actorId });

  if (!actor) return null;
  const [firstYear, lastYear] = bookends(actor.movies).map(m => m.year);
  const handleClick = (params: { movieId: number }) => () => onSelectMovie(params.movieId);

  return (
    <Sidebar>
      <Sidebar.CloseButton onClose={onClose} />
      <Crate gap={1} column alignCenter my={3}>
        <Text bold size="xl">
          {actor.name}
        </Text>
        <TheaterBackground>
          <PersonPoster name={actor.name} poster_path={actor.profilePath} variant="card" />
        </TheaterBackground>
        <Sidebar.StarBar>
          <Text bold>
            Movie Run: {firstYear} to {lastYear}
          </Text>
        </Sidebar.StarBar>
      </Crate>
      <Crate column gap={2} mb={6}>
        {actor.movies.map(movie => (
          <Crate key={movie.character + movie.movieId}>
            <Text {...listItem}>
              {movie.character} in <Movie {...movie} onClick={handleClick(movie)} />
            </Text>
          </Crate>
        ))}
        {actor.crewMovies.length > 0 && <Sidebar.Separator />}
        {actor.crewMovies.map(movie => (
          <Crate key={movie.job + movie.movieId}>
            <Text {...listItem}>
              {movie.job} on <Movie {...movie} onClick={handleClick(movie)} />
            </Text>
          </Crate>
        ))}
      </Crate>
    </Sidebar>
  );
};

const listItem = { noWrap: false, flex: false };

type MovieProps = { title: string; year: string; onClick: () => void };
const Movie = ({ title, onClick, year }: MovieProps) => (
  <Text {...listItem} bold onClick={onClick} tag="span">
    {title} ({year})
  </Text>
);
