import useSWR from 'swr';
import { ImdbLink, SpotifyLink } from '~/components/external-links';
import { Icon, type IconKey } from '~/components/icons';
import { MovieCardPoster, TheaterBackground } from '~/components/images';
import { type GetMovieByIdResponse } from '~/pages/api/movies/[id]';
import { fetcher } from '~/utils/api';
import { Button } from './ui/button';
import { PropsWithChildren } from 'react';

type MovieCardSidebar = {
  personId?: number;
  movieId: number;
  onClose: () => void;
};

export const MovieCardSidebar = ({ movieId, onClose, personId }: MovieCardSidebar) => {
  const { data: movie } = useSWR<GetMovieByIdResponse>(
    `/api/movies/${movieId}?${personId ? `actorId=${personId}` : ''}`,
    fetcher
  );

  if (!movie) return null;
  return (
    <div className="fixed right-0 top-8 z-10 h-full w-3/4 overflow-y-scroll border-l-4 bg-slate-100 p-5 pb-8 text-center md:w-1/2 lg:w-1/4">
      <Button variant="card" onClick={onClose} className="block w-full bg-red-400 hover:bg-red-300">
        Close
      </Button>
      <div className="mt-5 flex flex-col items-center space-y-1.5">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">{movie.title}</h3>
        <TheaterBackground>
          <MovieCardPoster {...movie} size={150} />
        </TheaterBackground>
        <p className="text-sm text-slate-600">{movie.tagline}</p>
        {movie.character && (
          <p className="flex items-center space-x-3 text-lg">
            <Icon.Star className="text-yellow-500" />
            <span>{movie.character}</span>
            <Icon.Star className="text-yellow-500" />
          </p>
        )}
      </div>
      <div>
        <Separator />
        {movie.hosts.map(({ id, name }) => (
          <IconField icon="Mic" key={id}>
            {name}
          </IconField>
        ))}
        <Separator />
        {movie.directors.map(({ id, name }) => (
          <IconField icon="Video" key={id}>
            {name}
          </IconField>
        ))}
        {movie.actors.map(({ id, name }) => (
          <IconField icon="Star" key={id}>
            {name}
          </IconField>
        ))}
        {movie.streamers.length > 0 && <Separator />}
        {movie.streamers.map(({ id, name }) => (
          <IconField icon="Tv" key={id}>
            {name}
          </IconField>
        ))}
        <Separator />
        <IconField icon="Calendar">{movie.release_date}</IconField>
        <IconField icon="Clock">{movie.runtime}</IconField>
        <IconField icon="Dollar">
          {movie.budget} / {movie.revenue}
        </IconField>
        <Separator />
        <IconField icon="Link">
          <ImdbLink id={movie.imdb_id} className="mx-1 hover:underline">
            IMDB
          </ImdbLink>
        </IconField>
        <IconField icon="Link">
          <SpotifyLink url={movie.spotify_url} className="mx-1 hover:underline">
            Spotify
          </SpotifyLink>
        </IconField>
      </div>
    </div>
  );
};

const Separator = () => <hr className="my-2 border-slate-300" />;

const IconField = ({ children, icon }: PropsWithChildren<{ icon: IconKey }>) => {
  const IconComponent = Icon[icon];
  return (
    <p className="my-1 flex items-center">
      <IconComponent className="mr-2" /> {children}
    </p>
  );
};
