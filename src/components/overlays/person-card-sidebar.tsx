import { Sidebar } from '~/components/ui/sidebar';
import { QpSchema } from '~/data/query-params';
import { trpc } from '~/trpc/client';
import { AppEnums } from '~/utils/enums';
import { titleCase } from '~/utils/format';
import { bookends } from '~/utils/object';
import { Crate } from '../ui/box';
import { Spotlight } from '../ui/spotlight';
import { Text } from '../ui/text';

type PersonCardSidebarProps = {
  personId: number;
  field: AppEnums['topCategory'];
  subField: AppEnums['topCategorySub'];
  queryParams: QpSchema;
  onClose: () => void;
  onSelectMovie: (movieId: number) => void;
};

export const PersonCardSidebar = ({
  personId,
  field,
  onClose,
  onSelectMovie,
  queryParams,
  subField,
}: PersonCardSidebarProps) => {
  const { data: person } = trpc.getPerson.useQuery({
    field,
    subField,
    id: personId,
    params: queryParams,
  });

  if (!person || !person?.movies) return null;

  const handleClick = (params: { id: number }) => () => onSelectMovie(params.id);
  const [firstYear, lastYear] = bookends(person.movies).map(m => (m ? Number(m.year) : 0));
  const runLength = lastYear && firstYear ? lastYear - firstYear : 1;

  return (
    <Sidebar>
      <Sidebar.CloseButton onClose={onClose} />
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
              {movie.title} ({movie.year})
            </Text>
            {movie.character && <Text>{movie.character}</Text>}
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
