import { Sidebar } from '~/components/ui/sidebar';
import { trpc } from '~/trpc/client';
import { AppEnums } from '~/utils/enums';
import { titleCase } from '~/utils/format';
import { bookends } from '~/utils/object';
import { useMovieMode } from '~/utils/use-movie-mode';
import { Crate } from '../ui/box';
import { Spotlight } from '../ui/spotlight';
import { Text } from '../ui/text';

type ActorCardSidebar = {
  actorId: number;
  field: AppEnums['topCategory'];
  onClose: () => void;
  onSelectMovie: (movieId: number) => void;
};

export const ActorCardSidebar = ({ actorId, field, onClose, onSelectMovie }: ActorCardSidebar) => {
  const filter = useMovieMode();
  const { data: actor } = trpc.getActor.useQuery({ field, filter, id: actorId });

  if (!actor) return null;

  const handleClick = (params: { movieId: number }) => () => onSelectMovie(params.movieId);
  const [firstYear, lastYear] = bookends(actor.movies).map(m => Number(m.year));
  const runLength = lastYear && firstYear ? lastYear - firstYear : 1;

  return (
    <Sidebar>
      <Sidebar.CloseButton onClose={onClose} />
      <Crate my={3} className="w-full">
        <Spotlight
          image={actor.image!}
          name={actor.name}
          variant="person"
          tagline={`${runLength} year run with ${actor.movies.length} movies`}
        />
      </Crate>
      <Crate column gap={2} mb={6}>
        {actor.movies.map(movie => (
          <Crate key={movie.character + movie.movieId} column my={1}>
            <Text bold onClick={handleClick(movie)} tag="span" icon="FilmStrip">
              {movie.title} ({movie.year})
            </Text>
            <Text>{movie.character}</Text>
            {movie.oscar && (
              <Text secondary>
                Best {titleCase(movie.oscar.award)} ({movie.oscar.won ? 'Won' : 'Nominated'})
              </Text>
            )}
          </Crate>
        ))}
      </Crate>
    </Sidebar>
  );
};
