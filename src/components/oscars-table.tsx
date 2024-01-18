import { trpc } from '~/trpc/client';
import Layout from './layout';
import { Table } from './ui/table';

export const OscarsTable = () => {
  const { data = [] } = trpc.getOscarsByYear.useQuery({ yearGte: 2005, yearLte: 2010 });
  return (
    <Layout title="Oscar Awards">
      <Table>
        <Table.Head>
          <Table.Header>Award</Table.Header>
          <Table.Header>Movie</Table.Header>
          <Table.Header>Recipient</Table.Header>
          <Table.Header>Won</Table.Header>
          <Table.Header>Ceremony Year</Table.Header>
        </Table.Head>
        <Table.Body>
          {data.map(oscar => (
            <Table.Row key={oscar.id}>
              <td>{oscar.award.name}</td>
              <td>{oscar.movie.title}</td>
              <td>{oscar.recipient}</td>
              <td>{oscar.won ? 'Winner' : ''}</td>
              <td>{oscar.ceremony_year}</td>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Layout>
  );
};
