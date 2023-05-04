import moviesJson from './movies.json';
import episodesJson from './episodes.json';
import { MoviesJson, EpisodesJson } from '~/types';
import { HashUpsertContainer, hashUpsert, topOfHash } from '~/utils';

const episodes = episodesJson as Episodes;
const movies = (moviesJson as Movies).map((m) => ({
  ...m,
  episode: episodes.find((e) => e.movieId === m.id) || null,
}));

type Movies = MoviesJson;
type Movie = Movies[number] & { episode?: Episode | null };
type PartialMovie = Partial<Movie>;
type Actor = Movie['credits']['cast'][number];
type PartialActor = Partial<Actor>;
type Crew = Movie['credits']['crew'][number];
type PartialCrew = Partial<Crew>;
type Episodes = EpisodesJson;
type Episode = Episodes[number];

type MovieMapper<TFilteredMovie extends PartialMovie> = (
  movie: Movie
) => TFilteredMovie;

type ActorMapper<TFilteredActor extends PartialActor> = (
  actor: Actor
) => TFilteredActor;

type CrewMapper<TFilteredCrew extends PartialCrew> = (
  crew: Crew
) => TFilteredCrew;

const DB = class {
  private get movies() {
    return movies;
  }

  // db.movieById(123, movie => pick(movie, ['title']))
  movieById<TFilteredMovie extends PartialMovie>(
    id: number,
    map: MovieMapper<TFilteredMovie>
  ) {
    const result = this.movies.find((m) => m.id === id);
    return result ? map(result) : result;
  }

  // db.movieByQuery('rocky', movie => pick(movie, ['title']))
  movieByQuery<TFilteredMovie extends PartialMovie>(
    query: string,
    map: MovieMapper<TFilteredMovie>
  ) {
    return this.movies
      .filter((m) =>
        query ? m.title.toLowerCase().includes(query.toLowerCase()) : m
      )
      .map(map);
  }

  // db.topActors(3, actor => pick(actor, ['id', 'name']), movie => pick(movie, ['title']));
  topActors<
    TFilteredActor extends PartialActor & { id: number },
    TFilteredMovie extends PartialMovie & { id: number }
  >(
    limit: number,
    mapActor: ActorMapper<TFilteredActor>,
    mapMovie: MovieMapper<TFilteredMovie>
  ) {
    const actorsHash = {} as HashUpsertContainer<
      TFilteredActor,
      TFilteredMovie
    >;
    this.movies.forEach((movie) => {
      const moviePayload = mapMovie(movie);
      movie.credits.cast.forEach((actor) => {
        const actorPayload = mapActor(actor);
        hashUpsert(actorsHash, actorPayload, moviePayload);
      });
    });
    const sorted = topOfHash(actorsHash, limit);
    return sorted;
  }

  // db.topCrew(5, 'director', crew => pick(crew, ['id', 'name']), movie => pick(movie, ['title']))
  topCrew<
    TFilteredCrew extends PartialCrew & { id: number },
    TFilteredMovie extends PartialMovie & { id: number }
  >(
    limit: number,
    job: 'director' | 'producer' | 'writer' | 'cinematographer',
    mapCrew: CrewMapper<TFilteredCrew>,
    mapMovie: MovieMapper<TFilteredMovie>
  ) {
    const crewHash = {} as HashUpsertContainer<TFilteredCrew, TFilteredMovie>;

    const matchesJob = {
      director: (crew: Crew) => crew.job === 'Director',
      producer: (crew: Crew) => crew.job === 'Producer',
      writer: (crew: Crew) =>
        crew.job === 'Screenplay' || crew.job === 'Writer',
      cinematographer: (crew: Crew) =>
        crew.job === 'Director of Photography' || crew.job === 'Cinematography',
    }[job];

    this.movies.forEach((movie) => {
      const moviePayload = mapMovie(movie);
      movie.credits.crew.forEach((crew) => {
        if (matchesJob(crew)) {
          const crewPayload = mapCrew(crew);
          hashUpsert(crewHash, crewPayload, moviePayload);
        }
      });
    });
    const sorted = topOfHash(crewHash, limit);
    return sorted;
  }
};

export const db = new DB();
