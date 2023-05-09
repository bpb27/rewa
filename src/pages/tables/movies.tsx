import Image from 'next/image';
import Layout from '~/components/layout';
import { PropsWithChildren, useMemo, useState } from 'react';
import { moneyShort, smartSort } from '~/utils';
import { mapValues, omit, uniqBy } from 'remeda';
import { StaticProps } from '~/types';
import { ImdbLink, SpotifyLink } from '~/components/external-links';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
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

  // TODO: fix bang by filtering nulls?
  const movies = data.map((movie) => ({
    ...omit(movie, [
      'actors_on_movies',
      'crew_on_movies',
      'genres_on_movies',
      'streamers_on_movies',
    ]),
    year: new Date(movie.release_date).getFullYear().toString(),
    actors: movie.actors_on_movies.map((jt) => jt.actors!).slice(0, 3),
    actorIds: movie.actors_on_movies.map((jt) => jt.actors?.id),
    crew: movie.crew_on_movies.map((jt) => ({ ...jt.crew!, job: jt.job })),
    genres: movie.genres_on_movies.map((jt) => jt.genres!),
    streamers: movie.streamers_on_movies.map((jt) => jt.streamers!),
    episode: movie.episodes.map((ep) => ({
      ...omit(ep, ['hosts_on_episodes']),
      hosts: ep.hosts_on_episodes.map((jt) => jt.hosts!),
    }))[0],
  }));

  return {
    props: { movies },
  };
};

export default function Movies({ movies }: StaticProps<typeof getStaticProps>) {
  type Movie = (typeof movies)[0];
  type SortProp = keyof typeof sorting;

  const [asc, setAsc] = useState(true);
  const [search, setSearch] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [orderBy, setOrderBy] = useState<SortProp>('title');

  const addToken = (newToken: Token) => {
    if (hasToken(tokens, newToken)) {
      setTokens(removeToken(tokens, newToken));
    } else {
      setTokens([...tokens, newToken]);
    }
  };

  const sorting = {
    budget: (m: Movie) => m.budget,
    director: (m: Movie) => m.crew[0]?.name,
    episodeNumber: (m: Movie) => m.episode.episode_order,
    profit: (m: Movie) => (m.revenue * 1000) / m.budget,
    release_date: (m: Movie) => m.release_date,
    revenue: (m: Movie) => m.revenue,
    runtime: (m: Movie) => m.runtime,
    title: (m: Movie) => m.title,
  };
  const sortProps = mapValues(sorting, (_value, key) => key);

  const movieList = useMemo(() => {
    const list = smartSort([...movies], sorting[orderBy]);
    if (!asc) list.reverse();

    const directorTokens = tokens.filter((t) => t.type === 'director');
    const actorTokens = tokens.filter((t) => t.type === 'actor');
    const streamerTokens = tokens.filter((t) => t.type === 'streamer');
    const hostTokens = tokens.filter((t) => t.type === 'host');
    const yearTokens = tokens.filter((t) => t.type === 'year');

    return list.filter((movie) => {
      const actorIds = movie.actorIds;
      const directorIds = movie.crew.map((c) => c.id);
      const streamerIds = movie.streamers.map((c) => c.id);
      const hostIds = movie.episode.hosts.map((c) => c.id);
      const yearIds = [Number(movie.year)];

      if (
        !directorTokens.every((t) => directorIds.includes(t.id)) ||
        !actorTokens.every((t) => actorIds.includes(t.id)) ||
        !streamerTokens.every((t) => streamerIds.includes(t.id)) ||
        !hostTokens.every((t) => hostIds.includes(t.id)) ||
        !yearTokens.every((t) => yearIds.includes(t.id))
      ) {
        return false;
      }

      if (!movie.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [asc, movies, orderBy, search, tokens]);

  return (
    <Layout title="All movies" className="mt-3 mx-2">
      <div className="flex items-center my-2 py-2">
        <h2 className="text-xl font-semibold">
          {movieList.length} movie{movieList.length === 1 ? '' : 's'}
        </h2>
        <input
          className="mx-2 p-1 border-slate-200 border-solid border-2"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title"
          value={search}
        />
        <select
          className="p-2"
          onChange={(e) => setOrderBy(e.target.value as SortProp)}
          value={orderBy}
        >
          <option value={sortProps.title}>Title</option>
          <option value={sortProps.release_date}>Year</option>
          <option value={sortProps.episodeNumber}>Episode</option>
          <option value={sortProps.runtime}>Runtime</option>
          <option value={sortProps.revenue}>Box Office</option>
          <option value={sortProps.budget}>Budget</option>
          <option value={sortProps.profit}>Profit %</option>
          <option value={sortProps.director}>Director</option>
        </select>
        <button className="text-lg ml-2" onClick={() => setAsc(!asc)}>
          {asc ? <span>&#8593;</span> : <span>&#8595;</span>}
        </button>
      </div>
      <div className="my-2">
        {tokens.map((token) => (
          <TableToken
            key={`${token.id}-${token.type}`}
            onClick={() => setTokens(removeToken(tokens, token))}
          >
            {token.name}
          </TableToken>
        ))}
      </div>
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
            <th>Links</th>
            <th>Box Office</th>
            <th>Budget</th>
            <th>Runtime</th>
          </tr>
        </thead>
        <tbody>
          {movieList.map((m, i) => (
            <tr
              key={m.id}
              className={`${(i + 1) % 2 && 'bg-slate-100'} text-left`}
            >
              <td>
                <Image
                  src={`https://image.tmdb.org/t/p/original${m.poster_path}`}
                  alt={`Movie poster for ${m.title}`}
                  width={42}
                  height={64}
                  className="border-slate-500 border-solid border-2"
                />
              </td>
              <td className="md:max-w-2xl">{m.title}</td>
              <td>
                <ClickableField
                  fields={[{ id: Number(m.year), name: m.year }]}
                  setter={addToken}
                  type="year"
                />
              </td>
              <td>
                <ClickableField
                  fields={m.crew}
                  setter={addToken}
                  type="director"
                />
              </td>
              <td>
                <ClickableField
                  fields={m.actors}
                  setter={addToken}
                  type="actor"
                />
              </td>
              <td>
                <ClickableField
                  fields={m.episode.hosts}
                  setter={addToken}
                  type="host"
                />
              </td>
              <td>
                <ClickableField
                  fields={m.streamers}
                  setter={addToken}
                  type="streamer"
                />
              </td>
              <td>
                <div>
                  <ImdbLink id={m.imdb_id}>IMDB</ImdbLink>
                </div>
                <div>
                  {m.episode.spotify_url && (
                    <SpotifyLink url={m.episode.spotify_url}>
                      Spotify
                    </SpotifyLink>
                  )}
                </div>
              </td>
              <td>{moneyShort(m.revenue * 1000)}</td>
              <td>{moneyShort(m.budget)}</td>
              <td>{m.runtime} mins</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

type TableTokenProps = PropsWithChildren<{ onClick: (...args: any[]) => void }>;

const TableToken = ({ children, onClick }: TableTokenProps) => (
  <button
    className="p-1 mr-2 border-2 border-slate-700 rounded-md"
    onClick={() => onClick()}
  >
    {children}
    <span className="ml-2">&times;</span>
  </button>
);

type ClickableFieldProps = {
  fields: Omit<Token, 'type'>[];
  setter: (v: Token) => void;
  type: TokenType;
};

const ClickableField = ({ fields, setter, type }: ClickableFieldProps) => {
  return (
    <>
      {fields.map((item) => (
        <div
          className="cursor-pointer"
          key={item.name}
          onClick={() => setter({ ...item, type })}
        >
          {item.name}&nbsp;
        </div>
      ))}
    </>
  );
};

type TokenType = 'director' | 'actor' | 'year' | 'host' | 'streamer';
type BaseToken = { id: number; name: string; type: TokenType };
type Token<TObject extends BaseToken = BaseToken> = TObject;

const removeToken = (tokens: Token[], { id, type }: Token) =>
  tokens.filter((t) => !(t.type === type && t.id === id));

const hasToken = (tokens: Token[], { id, type }: Token) =>
  !!tokens.find((t) => t.type === type && t.id === id);
