import Image from 'next/image';
import useSWR from 'swr';
import { GetMovieByIdResponse } from '~/pages/api/movies/[id]';
import { fetcher, formatDate, moviePosterSize } from '~/utils';

type Props = {
  personId?: number;
  movieId: number;
  onClose: () => void;
};

export const Movie = ({ movieId, personId, onClose }: Props) => {
  const { data, error, isLoading } = useSWR<GetMovieByIdResponse>(
    `/api/movies/${movieId}`,
    fetcher
  );

  if (!data) return null;

  // TODO: make sure this doesn't incorrectly render
  const role = data.credits.cast.find((c) => c.id === personId);
  const director = data.credits.crew.find((c) => c.job === 'Director');

  // TODO: image loader, standardized width
  return (
    <div className="fixed right-0 p-5 bg-slate-100 h-full w-1/4">
      <button
        className="p-2 bg-red-400 rounded-md font-semibold w-full"
        onClick={() => onClose()}
      >
        Close
      </button>
      <h1 className="text-2xl font-bold underline">{data.title}</h1>
      <p>
        {formatDate(data.release_date)} - {data.runtime}mins
      </p>
      {director && <p>Directed by {director.name}</p>}
      <Image
        src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
        alt={`Movie poster for ${data.title}`}
        className="m-1 border-2 border-black"
        {...moviePosterSize(200)}
      />
      {role && <p>{role.character}</p>}
      <p>{data.tagline}</p>
      <a
        href={`https://www.imdb.com/title/${data.imdb_id}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block p-3 bg-yellow-200 rounded-md mr-3 font-semibold w-full"
      >
        Movie on IMDB
      </a>
      {data.episode && (
        <a
          href={data.episode.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block p-3 bg-green-400 rounded-md font-semibold w-full"
        >
          Episode on Spotify
        </a>
      )}
    </div>
  );
};
