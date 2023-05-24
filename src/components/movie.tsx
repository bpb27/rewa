import Image from 'next/image';
import useSWR from 'swr';
import { GetMovieByIdResponse } from '~/pages/api/movies/[id]';
import { fetcher, formatDate, moviePosterSize } from '~/utils';
import { ExternalLinkIcon, ImdbLink, SpotifyLink } from './external-links';

type Props = {
  personId?: number;
  movieId: number;
  onClose: () => void;
};

export const Movie = ({ movieId, personId, onClose }: Props) => {
  const { data, error, isLoading } = useSWR<GetMovieByIdResponse>(
    `/api/movies/${movieId}?${personId ? `actorId=${personId}` : ''}`,
    fetcher
  );

  if (!data || !data.movie) return null;
  const { actor, movie } = data;
  const episode = movie.episodes[0];

  return (
    <div className="fixed right-0 top-8 z-10 h-full w-3/4 border-l-4 bg-slate-100 p-5 text-center md:w-1/2 lg:w-1/4">
      <button
        className="mb-3 w-full rounded-md border-2 border-red-500 bg-red-400 p-2 font-semibold"
        onClick={() => onClose()}
      >
        Close
      </button>
      <h1 className="text-2xl font-bold">{movie.title}</h1>
      <p>
        {formatDate(movie.release_date)} - {movie.runtime}mins
      </p>
      {/* {director && <p>Directed by {director.name}</p>} */}
      <div className="flex justify-center">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
          alt={`Movie poster for ${movie.title}`}
          className="m-1 border-2 border-black drop-shadow-lg"
          {...moviePosterSize(200)}
        />
      </div>
      {actor && <p className="mb-3">{actor.character}</p>}
      <p className="mb-3">{movie.tagline}</p>
      <ImdbLink
        id={movie.imdb_id}
        className="my-2 mr-3 flex w-full items-center justify-center rounded-md border-2 border-yellow-300 bg-yellow-200 p-2 text-center font-semibold"
      >
        IMDB <ExternalLinkIcon className="ml-2" />
      </ImdbLink>
      {episode && (
        <SpotifyLink
          url={episode.spotify_url}
          className="my-2 mr-3 flex w-full items-center justify-center rounded-md border-2 border-green-300 bg-green-200 p-2 text-center font-semibold"
        >
          Spotify <ExternalLinkIcon className="ml-2" />
        </SpotifyLink>
      )}
      {episode && episode.hosts_on_episodes.length > 1 && (
        <p>{episode.hosts_on_episodes.map((h) => h.hosts?.name).join(', ')}</p>
      )}
    </div>
  );
};
