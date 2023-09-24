import { useState, type PropsWithChildren } from 'react';
import { ImdbLink, SpotifyLink } from '~/components/external-links';
import { Icon } from '~/components/icons';
import { MovieCardPoster, TheaterBackground } from '~/components/images';
import { type Movie } from '~/components/movie-table-page';
import { type Token } from '~/data/tokens';
import { formatDate } from '~/utils/format';

interface MovieCardProps extends Movie {
  onTokenClick: (token: Token) => void;
}

export const MovieCard = ({ onTokenClick, ...movie }: MovieCardProps) => {
  const [showDesc, setShowDesc] = useState(false);
  return (
    <div className="mb-5 flex w-[350px] flex-col rounded-lg border-2 border-slate-600 bg-slate-100 text-slate-950 shadow-lg">
      <div className="flex flex-col items-center space-y-1.5 p-5">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">{movie.title}</h3>
        <TheaterBackground>
          <MovieCardPoster {...movie} />
        </TheaterBackground>
        <p
          className="flex cursor-pointer items-center text-sm text-slate-500 hover:underline"
          onClick={() => setShowDesc(!showDesc)}
        >
          {movie.tagline}
        </p>
        {showDesc && <p>{movie.overview}</p>}
      </div>
      <div className="flex flex-col p-6 pt-0">
        {movie.hosts.map(host => (
          <ClickableField key={host.id} item={host} onClick={onTokenClick} />
        ))}
        <Separator />
        {movie.directors.map(director => (
          <ClickableField key={director.id} item={director} onClick={onTokenClick} />
        ))}
        {movie.actors.slice(0, 2).map(actor => (
          <ClickableField key={actor.id} item={actor} onClick={onTokenClick} />
        ))}
        <Separator />
        <ClickableField item={movie.year} onClick={onTokenClick}>
          <span>{formatDate(movie.release_date)}</span>
        </ClickableField>
        <ClickableField item={movie.runtime} onClick={onTokenClick} />
        <ClickableField item={movie.budget} onClick={() => {}}>
          <span onClick={() => onTokenClick(movie.budget)} className="mr-1">
            {movie.budget.name}
          </span>
          <span>/</span>
          <span onClick={() => onTokenClick(movie.revenue)} className="ml-1">
            {movie.revenue.name}
          </span>
        </ClickableField>
        <Separator />
        <div className="my-1 flex">
          <Icon.Link className="mr-2" />{' '}
          <ImdbLink id={movie.imdb_id} className="mx-1 hover:underline">
            IMDB
          </ImdbLink>
          <span>/</span>
          <SpotifyLink url={movie.episode.spotify_url} className="mx-1 hover:underline">
            Spotify
          </SpotifyLink>
        </div>
        {movie.streamers.length > 0 && <Separator />}
        {movie.streamers.map(streamer => (
          <ClickableField key={streamer.id} item={streamer} onClick={onTokenClick} />
        ))}
      </div>
    </div>
  );
};

type MovieCardsProps = {
  movies: Movie[];
  onTokenClick: (token: Token) => void;
};

export const MovieCards = ({ movies, onTokenClick }: MovieCardsProps) => (
  <div className="flex flex-wrap justify-evenly">
    {movies.map(movie => (
      <MovieCard {...movie} key={movie.id} onTokenClick={onTokenClick} />
    ))}
  </div>
);

type ClickableFieldProps = PropsWithChildren<{
  item: Token;
  onClick: (t: Token) => void;
}>;

const ClickableField = ({ children, item, onClick }: ClickableFieldProps) => {
  return (
    <div
      className="my-1 flex cursor-pointer hover:underline"
      key={item.id}
      onClick={() => onClick(item)}
    >
      {item.type === 'host' && <Icon.Mic className="mr-2 text-green-700" />}
      {item.type === 'director' && <Icon.Video className="mr-2 text-yellow-500" />}
      {item.type === 'actor' && <Icon.Star className="mr-2 text-yellow-500" />}
      {item.type === 'year' && <Icon.Calendar className="mr-2 text-blue-800" />}
      {item.type === 'runtime' && <Icon.Clock className="mr-2 text-blue-800" />}
      {item.type === 'streamer' && <Icon.Tv className="mr-2 text-red-700" />}
      {item.type === 'budget' && <Icon.Dollar className="mr-2 text-blue-800" />}
      {children ? children : <span>{item.name}</span>}
    </div>
  );
};

const Separator = () => <hr className="my-2 border-slate-400" />;
