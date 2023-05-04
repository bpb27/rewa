import { db } from '~/db/db';
import { pick } from 'remeda';
import { TopCategory } from '~/components/top-category';
import { StaticProps } from '~/types';

export const getStaticProps = () => {
  const producers = db.topCrew(
    35,
    'producer',
    (crew) => pick(crew, ['id', 'name', 'profile_path']),
    (movie) => pick(movie, ['id', 'title', 'poster_path', 'release_date'])
  );
  return { props: { producers } };
};

export default function TopProducers({
  producers,
}: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={producers} title="Top Producers" />;
}
