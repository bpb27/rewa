import { useState } from 'react';
import { trpc } from '~/trpc/client';
import { ApiResponses } from '~/trpc/router';
import { titleCase } from '~/utils/format';
import { MoviePoster, PersonPoster } from './images';
import Layout from './layout';
import { Crate } from './ui/box';
import { Modal } from './ui/modal';
import { Spotlight } from './ui/spotlight';
import { Table } from './ui/table';
import { Text } from './ui/text';

/*
  tokens: actorIds, directorIds, year + range, movieId, oscarCategories
  maybe actor + crew headshot
  normalize award names
*/

type Movie = ApiResponses['getOscarsByYear'][number]['movie'];

export const OscarsTable = () => {
  const { data = [] } = trpc.getOscarsByYear.useQuery({ year: 1928 });
  const [movieModal, setMovieModal] = useState<Movie | undefined>();
  return (
    <Layout title="Oscar Awards">
      <Table>
        <Table.Head>
          <Table.Header>Poster</Table.Header>
          <Table.Header>Movie</Table.Header>
          <Table.Header>Won</Table.Header>
          <Table.Header>Award</Table.Header>
          <Table.Header></Table.Header> {/* person poster */}
          <Table.Header>Recipient</Table.Header>
          <Table.Header>Ceremony Year</Table.Header>
        </Table.Head>
        <Table.Body>
          {data.map(oscar => (
            <Table.Row key={oscar.id}>
              <td>
                <MoviePoster
                  variant="table"
                  poster_path={oscar.movie.poster_path}
                  title={oscar.movie.title}
                />
              </td>
              <td>
                <Crate column gap={2}>
                  <Text bold className="max-w-[300px]">
                    {oscar.movie.title}
                  </Text>
                  <Text secondary onClick={() => setMovieModal(oscar.movie)}>
                    See description
                  </Text>
                </Crate>
              </td>
              <td>{oscar.won ? 'Won' : 'Nominated'}</td>
              <td>{titleCase(oscar.categoryName)}</td>
              <td className="min-w-[68px]">
                {oscar.actors.slice(0, 1).map(a => (
                  <PersonPoster
                    key={a.id}
                    variant="table"
                    name={a.name}
                    poster_path={a.profile_path}
                  />
                ))}
              </td>
              <td>
                <Crate column>
                  {oscar.actors.map(actor => (
                    <Text key={actor.id}>{actor.name}</Text>
                  ))}
                  {oscar.crew.map(crew => (
                    <Text key={crew.id}>{crew.name}</Text>
                  ))}
                  {!oscar.actors.length && !oscar.crew.length && (
                    <Text secondary className="max-w-[300px]">
                      {oscar.recipient}
                    </Text>
                  )}
                </Crate>
              </td>
              <td>{oscar.ceremonyYear}</td>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {!!movieModal && (
        <Modal isOpen={!!movieModal} onClose={() => setMovieModal(undefined)}>
          <Spotlight
            description={movieModal.overview}
            image={movieModal.poster_path}
            name={movieModal.title}
          />
        </Modal>
      )}
    </Layout>
  );
};
