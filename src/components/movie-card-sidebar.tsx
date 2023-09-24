import { type PropsWithChildren, useState } from 'react';
import useSWR from 'swr';
import { ImdbLink, SpotifyLink } from '~/components/external-links';
import { Icon, type IconKey } from '~/components/icons';
import { Sidebar } from '~/components/ui/sidebar';
import { type ApiGetMovieResponse } from '~/pages/api/movies/[id]';
import { fetcher } from '~/utils/api';
import { formatDate } from '~/utils/format';

type MovieCardSidebar = {
  movieId: number;
  actorId?: number;
  onClose: () => void;
};

export const MovieCardSidebar = ({ movieId, onClose, actorId }: MovieCardSidebar) => {
  const [showDesc, setShowDesc] = useState(false);
  const { data: movie } = useSWR<ApiGetMovieResponse>(
    `/api/movies/${movieId}?${actorId ? `actorId=${actorId}` : ''}`,
    fetcher
  );

  if (!movie) return null;
  return (
    <Sidebar>
      <Sidebar.CloseButton onClose={onClose} />
      <Sidebar.HeaderAndPoster {...movie} header={movie.title} />
      <div className="mt-2 flex flex-col items-center">
        <p
          className="flex cursor-pointer items-center text-sm text-slate-500 hover:underline"
          onClick={() => setShowDesc(!showDesc)}
        >
          {movie.tagline}
        </p>
        {showDesc && <p className="mt-2 text-left">{movie.overview}</p>}
        {movie.actor && (
          <Sidebar.StarBar>
            <span>{movie.actor.character}</span>
          </Sidebar.StarBar>
        )}
      </div>
      <div>
        <Sidebar.Separator />
        {movie.hosts.map(({ id, name }) => (
          <IconField icon="Mic" key={id}>
            {name}
          </IconField>
        ))}
        <Sidebar.Separator />
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
        {movie.streamers.length > 0 && <Sidebar.Separator />}
        {movie.streamers.map(({ id, name }) => (
          <IconField icon="Tv" key={id}>
            {name}
          </IconField>
        ))}
        <Sidebar.Separator />
        <IconField icon="Calendar">{formatDate(movie.release_date)}</IconField>
        <IconField icon="Clock">{movie.runtime.name}</IconField>
        <IconField icon="Dollar">
          {movie.budget.name} / {movie.revenue.name}
        </IconField>
        <Sidebar.Separator />
        <IconField icon="Link">
          <ImdbLink id={movie.imdb_id} className="mx-1 hover:underline">
            IMDB
          </ImdbLink>
        </IconField>
        <IconField icon="Link">
          <SpotifyLink url={movie.episode.spotify_url} className="mx-1 hover:underline">
            Spotify
          </SpotifyLink>
        </IconField>
      </div>
    </Sidebar>
  );
};

const IconField = ({ children, icon }: PropsWithChildren<{ icon: IconKey }>) => {
  const IconComponent = Icon[icon];
  return (
    <p className="my-1 flex items-center">
      <IconComponent className="mr-2" /> {children}
    </p>
  );
};
