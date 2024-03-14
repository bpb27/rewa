import { useCallback, useMemo } from 'react';
import { crewJobIdToTokenType, crewJobs } from '~/data/crew-jobs';
import { Token } from '~/data/tokens';
import { trpc } from '~/trpc/client';
import { smartSort } from '~/utils/sorting';
import { useMovieMode } from '~/utils/use-movie-mode';
import { PersonPoster } from '../images';
import { Crate } from '../ui/box';
import { Icon } from '../ui/icons';
import { Sidebar } from '../ui/sidebar';
import { Text } from '../ui/text';

type MovieCrewSidebarProps = {
  movieId: number;
  onClose: () => void;
  onTokenClick: (tokenType: Token['type'], id: number) => void;
};

export const MovieCrewSidebar = ({ movieId, onTokenClick, onClose }: MovieCrewSidebarProps) => {
  const movieMode = useMovieMode();
  const crew = trpc.getMovieCrew.useQuery({ movieId, movieMode });

  // TODO: crewId qp
  const handleClick = useCallback(
    (params: { jobId: number; id: number }) => {
      const tokenType = crewJobIdToTokenType(params.jobId);
      return tokenType ? { onClick: () => onTokenClick(tokenType, params.id) } : {};
    },
    [onTokenClick]
  );

  // TODO: better sorting, extract to sorting.ts
  const sorted: typeof crew.data = useMemo(() => {
    return smartSort(
      (crew.data || []).map(p => {
        if (crewJobs.director.includes(p.jobId)) return { ...p, order: 4 };
        if (crewJobs.cinematographer.includes(p.jobId)) return { ...p, order: 3 };
        if (crewJobs.writer.includes(p.jobId)) return { ...p, order: 2 };
        if (crewJobs.producer.includes(p.jobId)) return { ...p, order: 1 };
        return { ...p, order: 0 };
      }),
      p => p.order,
      'desc'
    );
  }, [crew.data]);

  return (
    <Sidebar unfixedWidth onClose={onClose}>
      <Crate column>
        {sorted?.map(person => (
          <Crate key={person.id} alignCenter gap={2} my={1}>
            <PersonPoster {...person} variant="table" />
            <Crate column>
              <Text bold {...handleClick(person)}>
                {person.name}
              </Text>
              <Text>{person.job}</Text>
              <Text secondary>
                <Icon.FilmStrip /> {person.total}
              </Text>
            </Crate>
          </Crate>
        ))}
      </Crate>
    </Sidebar>
  );
};
