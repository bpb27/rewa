import Image from 'next/image';
import { Icon } from '~/components/icons';
import Layout from '~/components/layout';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getYear, moneyShort, smartSort, useVizSensor } from '~/utils';
import { mapValues, pick } from 'remeda';
import { StaticProps } from '~/types';
import { ImdbLink, SpotifyLink } from '~/components/external-links';
import { FullTypeahead } from '~/components/full-typeahead';
import { Prisma } from '~/prisma';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import MovieCard from '~/components/movie-card';
import { Token, TokenType, hasToken, removeToken } from '~/utils/token';

const prisma = Prisma.getPrisma();
const selectIdAndName = { select: { id: true, name: true } };

export const getStaticProps = async () => {
  const data = await prisma.movies.findMany({
    orderBy: { title: 'asc' },
    select: {
      budget: true,
      id: true,
      imdb_id: true,
      poster_path: true,
      release_date: true,
      revenue: true, // NB: stored in DB as / 1000 due to BigInt shit
      runtime: true,
      title: true,
      tagline: true,
      actors_on_movies: {
        orderBy: { credit_order: 'asc' },
        select: { actors: selectIdAndName },
      },
      crew_on_movies: {
        where: { job: 'Director' },
        select: {
          job: true,
          crew: selectIdAndName,
        },
      },
      episodes: {
        select: {
          id: true,
          spotify_url: true,
          episode_order: true,
          hosts_on_episodes: { select: { hosts: selectIdAndName } },
        },
      },
      genres_on_movies: {
        select: { genres: selectIdAndName },
      },
      streamers_on_movies: {
        select: { streamers: selectIdAndName },
      },
    },
  });

  const movies = data.map((movie) => {
    const episode = movie.episodes[0];

    const actors = movie.actors_on_movies
      .filter((jt) => jt.actors)
      .map((jt) => jt.actors!)
      .map((item) => ({ ...item, type: 'actor' } satisfies Token));

    const hosts = episode.hosts_on_episodes
      .filter((jt) => jt.hosts)
      .map((jt) => jt.hosts!)
      .map((item) => ({ ...item, type: 'host' } satisfies Token));

    const directors = movie.crew_on_movies
      .filter((jt) => jt.job === 'Director')
      .map((jt) => jt.crew!)
      .map((item) => ({ ...item, type: 'director' } satisfies Token));

    const genres = movie.genres_on_movies
      .filter((jt) => jt.genres)
      .map((jt) => jt.genres!)
      .map((item) => ({ ...item, type: 'genre' } satisfies Token));

    const streamers = movie.streamers_on_movies
      .filter((jt) => jt.streamers)
      .map((jt) => jt.streamers!)
      .map((item) => ({ ...item, type: 'streamer' } satisfies Token));

    const budget = {
      id: movie.budget,
      name: moneyShort(movie.budget),
      type: 'budget',
    } satisfies Token;

    const revenue = {
      id: movie.revenue * 1000,
      name: moneyShort(movie.revenue * 1000),
      type: 'revenue',
    } satisfies Token;

    const runtime = {
      id: movie.runtime,
      name: `${movie.runtime} mins`,
      type: 'runtime',
    } satisfies Token;

    const year = {
      id: Number(getYear(movie.release_date)),
      name: getYear(movie.release_date),
      type: 'year',
    } satisfies Token;

    return {
      ...pick(movie, [
        'id',
        'imdb_id',
        'poster_path',
        'release_date',
        'tagline',
        'title',
      ]),
      budget,
      revenue,
      runtime,
      year,
      episode: pick(episode, ['episode_order', 'id', 'spotify_url']),
      actors: actors.slice(0, 3),
      actorIds: actors.map((a) => a.id),
      hosts,
      directors,
      genres,
      streamers,
    };
  });

  return {
    props: { movies },
  };
};

type Props = StaticProps<typeof getStaticProps>;
export type Movie = Props['movies'][number];
type SortProp = keyof typeof sorting;

export default function Movies({ movies }: Props) {
  const [asc, setAsc] = useState(false);
  const [rowNumber, setRowNumber] = useState(20);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [orderBy, setOrderBy] = useState<SortProp>('episodeNumber');
  const [displayType, setDisplayType] = useState<'table' | 'card'>('table');
  const vizSensorRef = useRef<HTMLDivElement>(null);

  useVizSensor(vizSensorRef, {
    rootMargin: '200px',
    threshold: 0.1,
    callback: () => {
      setRowNumber(rowNumber + 20);
    },
  });

  const addToken = (newToken: Token) => {
    if (hasToken(tokens, newToken)) {
      setTokens(removeToken(tokens, newToken));
    } else {
      setTokens([...tokens, newToken]);
    }
  };

  const movieList = useMemo(() => {
    const list = smartSort([...movies], sorting[orderBy]);
    if (!asc) list.reverse();

    const ids = (list: { id: number }[]) => list.map((i) => i.id);

    const tokensFor = (type: TokenType) =>
      tokens.filter((t) => t.type === type);

    const passes = (tokens: { id: number }[], ids: number[]) =>
      tokens.every((t) => ids.includes(t.id));

    return list.filter((movie) => {
      if (
        !passes(tokensFor('director'), ids(movie.directors)) ||
        !passes(tokensFor('streamer'), ids(movie.streamers)) ||
        !passes(tokensFor('host'), ids(movie.hosts)) ||
        !passes(tokensFor('genre'), ids(movie.genres)) ||
        !passes(tokensFor('actor'), movie.actorIds) || // full actor set (movie.actors just has top 3)
        !passes(tokensFor('movie'), [movie.id]) ||
        !passes(tokensFor('year'), [movie.year.id]) ||
        !tokensFor('runtime').every(
          (t) => Math.abs(t.id - movie.runtime.id) <= 10
        ) ||
        !tokensFor('budget').every(
          (t) => Math.abs(t.id - movie.budget.id) <= 10000000
        ) ||
        !tokensFor('revenue').every(
          (t) => Math.abs(t.id - movie.revenue.id) <= 10000000
        )
      ) {
        return false;
      }

      return true;
    });
  }, [asc, movies, orderBy, tokens]);

  useEffect(() => {
    setRowNumber(20);
  }, [movieList.length]);

  const sortProps = mapValues(sorting, (_value, key) => key);
  return (
    <Layout title="All movies">
      <div className="mb-1 mt-3 flex flex-col py-2">
        <FullTypeahead onSelect={(item) => addToken(item)} />
        <div>
          {tokens.length > 0 && (
            <Button
              className="bg-slate-100 hover:bg-slate-200"
              variant="outline"
              onClick={() => setTokens([])}
            >
              Clear <Icon.Close className="ml-2 text-slate-600" />
            </Button>
          )}
          {tokens.map((token) => (
            <Button
              className="bg-slate-100 hover:bg-slate-200"
              variant="outline"
              key={`${token.id}-${token.type}`}
              onClick={() => setTokens(removeToken(tokens, token))}
            >
              {token.name}
            </Button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center">
          <h2 className="text-xl font-semibold">
            {movieList.length} movie{movieList.length === 1 ? '' : 's'}
          </h2>
          <Select
            value={orderBy}
            onValueChange={(value) => setOrderBy(value as SortProp)}
          >
            <SelectTrigger className="w-[180px]" margin="ml-4">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={sortProps.title}>Title</SelectItem>
              <SelectItem value={sortProps.release_date}>Year</SelectItem>
              <SelectItem value={sortProps.episodeNumber}>Episode</SelectItem>
              <SelectItem value={sortProps.runtime}>Runtime</SelectItem>
              <SelectItem value={sortProps.revenue}>Box Office</SelectItem>
              <SelectItem value={sortProps.budget}>Budget</SelectItem>
              <SelectItem value={sortProps.profit}>Profit %</SelectItem>
              <SelectItem value={sortProps.director}>Director</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setAsc(!asc)} variant="secondary" margin="m-2">
            {asc ? <Icon.ArrowUp /> : <Icon.ArrowDown />}
          </Button>
          <Button
            className={
              displayType === 'table'
                ? 'border-2 border-solid border-slate-500'
                : ''
            }
            onClick={() => setDisplayType('table')}
            variant="secondary"
            margin="ml-2"
          >
            <Icon.Table />
          </Button>
          <Button
            className={`${
              displayType === 'card'
                ? 'border-2 border-solid border-slate-500'
                : ''
            }`}
            onClick={() => setDisplayType('card')}
            variant="secondary"
            margin="mr-2"
          >
            <Icon.Card />
          </Button>
        </div>
      </div>
      {displayType === 'card' && (
        <div className="flex flex-wrap justify-evenly">
          {movieList.slice(0, rowNumber).map((movie) => (
            <MovieCard {...movie} key={movie.id} onClickField={addToken} />
          ))}
        </div>
      )}
      {displayType === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left [&>th]:pr-6">
                <th>Poster</th>
                <th>Title</th>
                <th>Year</th>
                <th>Director</th>
                <th>Top Cast</th>
                <th>Hosts</th>
                <th>Streaming</th>
                <th>Box Office</th>
                <th>Budget</th>
                <th>Runtime</th>
                <th>Genres</th>
                <th>
                  <div className="flex">
                    Links
                    <Icon.Link className="ml-2" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {movieList.slice(0, rowNumber).map((m, i) => (
                <tr
                  key={m.id}
                  className={`${
                    (i + 1) % 2 && 'bg-slate-100'
                  } border-t-2 border-slate-200 text-left`}
                >
                  <td>
                    <Image
                      src={`https://image.tmdb.org/t/p/original${m.poster_path}`}
                      alt={`Movie poster for ${m.title}`}
                      width={42}
                      height={64}
                      className="border-2 border-solid border-slate-500"
                    />
                  </td>
                  <td className="max-w-[200px]  font-bold text-slate-700">
                    {m.title}
                  </td>
                  <td>
                    <ClickableField tokens={[m.year]} onClick={addToken} />
                  </td>
                  <td>
                    <ClickableField tokens={m.directors} onClick={addToken} />
                  </td>
                  <td>
                    <ClickableField tokens={m.actors} onClick={addToken} />
                  </td>
                  <td>
                    <ClickableField tokens={m.hosts} onClick={addToken} />
                  </td>
                  <td>
                    <ClickableField tokens={m.streamers} onClick={addToken} />
                  </td>
                  <td>
                    <ClickableField tokens={[m.revenue]} onClick={addToken} />
                  </td>
                  <td>
                    <ClickableField tokens={[m.budget]} onClick={addToken} />
                  </td>
                  <td>
                    <ClickableField tokens={[m.runtime]} onClick={addToken} />
                  </td>
                  <td>
                    <ClickableField tokens={m.genres} onClick={addToken} />
                  </td>
                  <td>
                    <div>
                      <ImdbLink id={m.imdb_id}>IMDB</ImdbLink>
                    </div>
                    <div>
                      <SpotifyLink url={m.episode.spotify_url}>
                        Spotify
                      </SpotifyLink>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div ref={vizSensorRef}></div>
    </Layout>
  );
}

const sorting = Object.freeze({
  budget: (m: Movie) => m.budget.id,
  director: (m: Movie) => m.directors[0]?.name,
  episodeNumber: (m: Movie) => m.episode.episode_order,
  profit: (m: Movie) => (m.revenue.id * 1000) / m.budget.id,
  release_date: (m: Movie) => m.release_date,
  revenue: (m: Movie) => m.revenue.id,
  runtime: (m: Movie) => m.runtime.id,
  title: (m: Movie) => m.title,
} satisfies { [k: string]: (m: Movie) => string | number });

const ClickableField = ({
  onClick,
  tokens,
}: {
  onClick: (v: Token) => void;
  tokens: Token[];
}) => {
  return (
    <>
      {tokens.map((item) => (
        <div
          className="cursor-pointer hover:underline"
          key={item.name}
          onClick={() => onClick(item)}
        >
          {item.name}
        </div>
      ))}
    </>
  );
};
