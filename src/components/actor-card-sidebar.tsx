import { Sidebar } from '~/components/ui/sidebar';
import { type ApiGetActorResponse } from '~/pages/api/actors/[id]';
import { useAPI } from '~/utils/use-api';
import { getYear } from '~/utils/format';

type ActorCardSidebar = {
  actorId: number;
  onClose: () => void;
  onSelectMovie: (movieId: number) => void;
};

export const ActorCardSidebar = ({ actorId, onClose, onSelectMovie }: ActorCardSidebar) => {
  const { data: actor } = useAPI(`/api/actors/${actorId}`);

  if (!actor) return null;
  const firstMovieYear = getYear(actor.movies[0].release_date);
  const lastMovieYear = getYear(actor.movies[actor.movies.length - 1].release_date);

  return (
    <Sidebar>
      <Sidebar.CloseButton onClose={onClose} />
      <Sidebar.HeaderAndPoster
        header={actor.name}
        poster_path={actor.profile_path!}
        title={actor.name}
      />
      <Sidebar.Content>
        <Sidebar.StarBar>
          <span className="flex flex-col">
            Movie Run: {firstMovieYear} to {lastMovieYear}
          </span>
        </Sidebar.StarBar>
        {actor.movies.map((movie, i, list) => (
          <ActorCredit
            movie={movie}
            isLast={i === list.length - 1}
            onSelectMovie={onSelectMovie}
            key={movie.character + movie.title + movie.movieId}
          />
        ))}
        {actor.crewMovies.length > 0 && (
          <div className="my-3">
            <Sidebar.StarBar>
              <span>Bonus</span>
            </Sidebar.StarBar>
          </div>
        )}
        {actor.crewMovies.map((movie, i, list) => (
          <CrewCredit movie={movie} key={movie.job + movie.title} isLast={i === list.length - 1} />
        ))}
      </Sidebar.Content>
    </Sidebar>
  );
};

type ActorCreditProps = {
  isLast: boolean;
  movie: ApiGetActorResponse['movies'][number];
  onSelectMovie: (id: number) => void;
};

const ActorCredit = ({ isLast, movie, onSelectMovie }: ActorCreditProps) => (
  <div className="w-full">
    <p>
      {movie.character} in{' '}
      <span
        className="cursor-pointer font-bold hover:underline"
        onClick={() => onSelectMovie(movie.movieId)}
      >
        {movie.title}
      </span>{' '}
      ({getYear(movie.release_date)})
    </p>
    {!isLast && <Sidebar.Separator />}
  </div>
);

type CrewCreditProps = {
  movie: ApiGetActorResponse['crewMovies'][number];
  isLast: boolean;
};

const CrewCredit = ({ isLast, movie }: CrewCreditProps) => (
  <div className="w-full text-slate-500">
    <p key={movie.job + movie.title + movie.movieId}>
      {movie.job} on <span className="font-bold">{movie.title}</span>
    </p>
    {!isLast && <Sidebar.Separator />}
  </div>
);
