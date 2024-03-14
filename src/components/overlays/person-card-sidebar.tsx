import { Sidebar } from '~/components/ui/sidebar';
import { ApiResponses } from '~/trpc/router';
import { newFormatDate, titleCase } from '~/utils/format';
import { bookends } from '~/utils/object';
import { Crate } from '../ui/box';
import { Spotlight } from '../ui/spotlight';
import { Text } from '../ui/text';

type PersonCardSidebarProps = {
  person: ApiResponses['getLeaderboard']['results'][number];
  onClose: () => void;
  onSelectMovie: (movieId: number) => void;
};

export const PersonCardSidebar = ({ onClose, onSelectMovie, person }: PersonCardSidebarProps) => {
  if (!person || !person?.movies) return null;

  const handleClick = (params: { id: number }) => () => onSelectMovie(params.id);
  const [firstYear, lastYear] = bookends(person.movies).map(m =>
    m ? Number(newFormatDate(m.releaseDate, 'year')) : 0
  );
  const runLength = lastYear && firstYear ? lastYear - firstYear : 1;

  return (
    <Sidebar onClose={onClose}>
      <Crate my={3} className="w-full">
        <Spotlight
          image={person.image!}
          name={person.name}
          variant="person"
          tagline={
            person.movies.length
              ? `${runLength || 1} year run with ${person.movies.length} movies`
              : 'Nerp.'
          }
        />
      </Crate>
      <Crate column gap={2} mb={6}>
        {person.movies.map(movie => (
          <Crate key={movie.id} column my={1}>
            <Text bold onClick={handleClick(movie)} tag="span" icon="FilmStrip">
              {movie.title} ({newFormatDate(movie.releaseDate, 'year')})
            </Text>
            {movie.character && <Text>{movie.character}</Text>}
            {movie.oscarCategory && (
              <Text secondary>
                Best {titleCase(movie.oscarCategory)} ({movie.oscarWon ? 'Won' : 'Nominated'})
              </Text>
            )}
          </Crate>
        ))}
      </Crate>
    </Sidebar>
  );
};
