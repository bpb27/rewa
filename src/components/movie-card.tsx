import { formatDate } from '~/utils';
import { ImdbLink, SpotifyLink } from '~/components/external-links';
import { Icon } from './icons';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardSeparator,
  CardTitle,
} from '~/components/ui/card';
import { Token } from '~/utils/token';
import { Movie } from '~/pages/tables/movies';
import { MovieCardPoster, TheaterBackground } from './images';
import { PropsWithChildren } from 'react';

interface MovieCardProps extends Movie {
  onClickField: (token: Token) => void;
}

export default function MovieCard(movie: MovieCardProps) {
  const handleClick = movie.onClickField;

  return (
    <Card className="mb-5 flex w-[350px] flex-col">
      <CardHeader className="items-center">
        <CardTitle>{movie.title}</CardTitle>
        <TheaterBackground>
          <MovieCardPoster {...movie} />
        </TheaterBackground>
        <CardDescription>{movie.tagline}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        {movie.hosts.map((host) => (
          <Field key={host.id} item={host} onClick={handleClick} />
        ))}
        <CardSeparator />
        {movie.directors.map((director) => (
          <Field key={director.id} item={director} onClick={handleClick} />
        ))}
        {movie.actors.slice(0, 2).map((actor) => (
          <Field key={actor.id} item={actor} onClick={handleClick} />
        ))}
        <CardSeparator />
        <Field item={movie.year} onClick={handleClick}>
          <span>{formatDate(movie.release_date)}</span>
        </Field>
        <Field item={movie.runtime} onClick={handleClick} />
        <Field item={movie.budget} onClick={() => {}}>
          <span onClick={() => handleClick(movie.budget)} className="mr-1">
            {movie.budget.name}
          </span>
          <span>/</span>
          <span onClick={() => handleClick(movie.revenue)} className="ml-1">
            {movie.revenue.name}
          </span>
        </Field>
        {movie.streamers.length > 0 && <CardSeparator />}
        {movie.streamers.map((streamer) => (
          <Field key={streamer.id} item={streamer} onClick={handleClick} />
        ))}
      </CardContent>
      <CardFooter className="justify-center">
        <Button asChild variant="outline" margin="mr-3">
          <ImdbLink id={movie.imdb_id}>
            <Icon.Link size={20} className="mr-2" /> IMDB
          </ImdbLink>
        </Button>
        <Button asChild variant="outline" margin="mr-3">
          <SpotifyLink url={movie.episode.spotify_url}>
            <Icon.Link size={20} className="mr-2" /> Spotify
          </SpotifyLink>
        </Button>
      </CardFooter>
    </Card>
  );
}

const Field = ({
  children,
  item,
  onClick,
}: PropsWithChildren<{
  item: Token;
  onClick: (t: Token) => void;
}>) => {
  return (
    <div
      className="my-1 flex cursor-pointer hover:underline"
      key={item.id}
      onClick={() => onClick(item)}
    >
      {item.type === 'host' && <Icon.Mic className="mr-2" />}
      {item.type === 'director' && <Icon.Video className="mr-2" />}
      {item.type === 'actor' && <Icon.Star className="mr-2" />}
      {item.type === 'year' && <Icon.Calendar className="mr-2" />}
      {item.type === 'runtime' && <Icon.Clock className="mr-2" />}
      {item.type === 'streamer' && <Icon.Tv className="mr-2" />}
      {item.type === 'budget' && <Icon.Dollar className="mr-2" />}
      {children ? children : <span>{item.name}</span>}
    </div>
  );
};
