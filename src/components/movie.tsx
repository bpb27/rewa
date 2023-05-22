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
    <div className="fixed top-8 right-0 z-10 p-5 text-center bg-slate-100 h-full w-3/4 md:w-1/2 lg:w-1/4 border-l-4">
      <button
        className="p-2 bg-red-400 border-red-500 border-2 rounded-md font-semibold w-full mb-3"
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
        className="my-2 flex items-center justify-center p-2 bg-yellow-200 rounded-md mr-3 font-semibold w-full border-yellow-300 border-2 text-center"
      >
        IMDB <ExternalLinkIcon className="ml-2" />
      </ImdbLink>
      {episode && (
        <SpotifyLink
          url={episode.spotify_url}
          className="my-2 flex items-center justify-center p-2 bg-green-200 rounded-md mr-3 font-semibold w-full border-green-300 border-2 text-center"
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
