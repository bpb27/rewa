import { useCallback } from 'react';
import { EbertLink, ImdbLink, SpotifyLink } from '~/components/external-links';
import { type MoviesPageMovie } from '~/components/movies-page';
import { Icon } from '~/components/ui/icons';
import { AppEnums } from '~/utils/enums';
import { formatRuntime, moneyShort } from '~/utils/format';
import { smartSort } from '~/utils/sorting';
import { MoviePoster } from './images';
import { Crate } from './ui/box';
import { PopoverMenu } from './ui/popover';
import { StarRating } from './ui/stars';
import { Table } from './ui/table';
import { Text } from './ui/text';

type MoviesTableProps = {
  mode: AppEnums['movieMode'];
  movies: MoviesPageMovie[];
  onSortClick: (sort: AppEnums['sort']) => void;
  onTokenClick: (tokenType: AppEnums['token'], tokenId: number) => void;
  onShowCastClick: (movieId: number) => void;
  onShowCrewClick: (movieId: number) => void;
  onShowPopularMoviesClick: (year: string) => void;
  onOscarYearClick: (params: { movieId: number; year: number }) => void;
  onMovieTitleClick: (id: number) => void;
};

export const MoviesTable = ({
  mode,
  movies,
  onMovieTitleClick,
  onOscarYearClick,
  onShowCastClick,
  onShowCrewClick,
  onShowPopularMoviesClick,
  onSortClick,
  onTokenClick,
}: MoviesTableProps) => {
  const showHosts = mode === 'rewa';
  const showEbert = mode === 'rewa';
  const handleHeaderClick = useCallback(
    (sortKey: AppEnums['sort']) => () => onSortClick(sortKey),
    [onSortClick]
  );
  return (
    <Table>
      <Table.Head>
        <Table.Header>Poster</Table.Header>
        <Table.Header onClick={handleHeaderClick('title')} sticky>
          Title
        </Table.Header>
        <Table.Header onClick={handleHeaderClick('release_date')}>Year</Table.Header>
        <Table.Header>Director</Table.Header>
        <Table.Header>Top Cast</Table.Header>
        <Table.Header>Oscars</Table.Header>
        {showHosts && <Table.Header>Hosts</Table.Header>}
        <Table.Header onClick={handleHeaderClick('budget')}>Budget</Table.Header>
        <Table.Header onClick={handleHeaderClick('revenue')}>Box Office</Table.Header>
        <Table.Header onClick={handleHeaderClick('runtime')}>Runtime</Table.Header>
        {showEbert && <Table.Header onClick={handleHeaderClick('ebert')}>Our Guy</Table.Header>}
        <Table.Header>Keywords</Table.Header>
        <Table.Header>Streaming</Table.Header>
        <Table.Header>
          <Crate>
            Links <Icon.Link className="ml-2" />
          </Crate>
        </Table.Header>
      </Table.Head>
      <Table.Body>
        {movies.map(m => (
          <Table.Row key={m.id}>
            <Table.Data className="p-0">
              <MoviePoster title={m.name} image={m.image} variant="table" />
            </Table.Data>
            <Table.Data sticky>
              <Text bold onClick={() => onMovieTitleClick(m.id)}>
                {m.name}
              </Text>
            </Table.Data>
            <Table.Data>
              <Crate column>
                <Text noWrap onClick={() => onTokenClick('year', Number(m.year))}>
                  {m.year}
                </Text>
                <Text secondary onClick={() => onShowPopularMoviesClick(m.year)} noWrap>
                  Show
                </Text>
              </Crate>
            </Table.Data>
            <Table.Data>
              <Crate column>
                {m.crew
                  .filter(c => c.job === 'director')
                  .slice(0, 2)
                  .map(d => (
                    <Text noWrap key={d.id} onClick={() => onTokenClick('director', d.id)}>
                      {d.name}
                    </Text>
                  ))}
                <Text secondary onClick={() => onShowCrewClick(m.id)}>
                  Show crew
                </Text>
              </Crate>
            </Table.Data>
            <Table.Data>
              <Crate column>
                {m.actors.map(a => (
                  <Text noWrap onClick={() => onTokenClick('actor', a.id)} tag="span" key={a.id}>
                    {a.name}
                  </Text>
                ))}
                <Text secondary onClick={() => onShowCastClick(m.id)}>
                  Show cast
                </Text>
              </Crate>
            </Table.Data>
            <Table.Data>
              <Crate column>
                <Text noWrap>
                  {m.totalOscarNominations} nom{m.totalOscarNominations === 1 ? '' : 's'}
                </Text>
                <Text noWrap>
                  {m.totalOscarWins} win{m.totalOscarWins === 1 ? '' : 's'}
                </Text>
                <Text
                  noWrap
                  hide={!m.totalOscarNominations}
                  onClick={() =>
                    onOscarYearClick({ movieId: m.id, year: m.oscars[0].ceremonyYear })
                  }
                  secondary
                >
                  Show
                </Text>
              </Crate>
            </Table.Data>
            {showHosts && m.episode && (
              <Table.Data>
                <Crate column>
                  {m.episode.hosts.slice(0, 3).map(h => (
                    <Text noWrap key={h.id} onClick={() => onTokenClick('host', h.id)}>
                      {h.name}
                    </Text>
                  ))}
                  {m.episode.hosts.length > 3 && (
                    <PopoverMenu
                      content={
                        <StandardPopover
                          items={m.episode.hosts}
                          onClick={id => onTokenClick('host', id)}
                        />
                      }
                    >
                      <Text noWrap secondary>
                        {m.episode.hosts.length - 3} more
                      </Text>
                    </PopoverMenu>
                  )}
                </Crate>
              </Table.Data>
            )}
            <Table.Data>
              <Text noWrap onClick={() => onTokenClick('budget', Number(m.budget))}>
                {moneyShort(Number(m.budget))}
              </Text>
            </Table.Data>
            <Table.Data>
              <Text noWrap onClick={() => onTokenClick('revenue', Number(m.revenue))}>
                {moneyShort(Number(m.revenue))}
              </Text>
            </Table.Data>
            <Table.Data>
              <Text noWrap onClick={() => onTokenClick('runtime', m.runtime)}>
                {formatRuntime(m.runtime)}
              </Text>
            </Table.Data>
            {showEbert && (
              <Table.Data>
                <StarRating value={m.ebert?.rating} />
              </Table.Data>
            )}
            <Table.Data>
              <Crate column>
                {m.keywords.slice(0, 3).map(k => (
                  <Text noWrap key={k.id} onClick={() => onTokenClick('keyword', k.id)}>
                    {k.name}
                  </Text>
                ))}
                {m.keywords.length > 3 && (
                  <PopoverMenu
                    content={
                      <StandardPopover
                        items={m.keywords}
                        onClick={id => onTokenClick('keyword', id)}
                      />
                    }
                  >
                    <Text noWrap secondary>
                      {m.keywords.length - 3} more
                    </Text>
                  </PopoverMenu>
                )}
              </Crate>
            </Table.Data>
            <Table.Data>
              <Crate column>
                {m.streamers.slice(0, 3).map(k => (
                  <Text
                    noWrap
                    key={k.id}
                    onClick={() => onTokenClick('streamer', k.id)}
                    ellipsisAt={150}
                  >
                    {k.name}
                  </Text>
                ))}
                {m.streamers.length > 3 && (
                  <PopoverMenu
                    content={
                      <StandardPopover
                        items={m.streamers}
                        onClick={id => onTokenClick('streamer', id)}
                      />
                    }
                  >
                    <Text noWrap secondary>
                      {m.streamers.length - 3} more
                    </Text>
                  </PopoverMenu>
                )}
              </Crate>
            </Table.Data>
            <Table.Data>
              <Crate column>
                <ImdbLink id={m.imdbId} className="text-blue-500 underline">
                  IMDB
                </ImdbLink>
                {!!m.episode && (
                  <SpotifyLink url={m.episode.spotifyUrl} className="text-blue-500 underline">
                    Spotify
                  </SpotifyLink>
                )}
                {!!m.ebert?.reviewUrl && (
                  <EbertLink path={m.ebert.reviewUrl} className="text-blue-500 underline">
                    Ebert
                  </EbertLink>
                )}
              </Crate>
            </Table.Data>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

type StandardPopoverProps = {
  items: { id: number; name: string }[];
  onClick: (id: number) => void;
};

const StandardPopover = ({ items, onClick }: StandardPopoverProps) => (
  <Crate column>
    {smartSort(items, t => t.name).map(t => (
      <Text noWrap key={t.id} onClick={() => onClick(t.id)}>
        {t.name}
      </Text>
    ))}
  </Crate>
);
