import { db } from '~/db/db';
import { pick } from 'remeda';
import { TopCategory } from '~/components/top-category';
import { StaticProps } from '~/types';

export const getStaticProps = () => {
  const writers = db.topCrew(
    35,
    'writer',
    (crew) => pick(crew, ['id', 'name', 'profile_path']),
    (movie) => pick(movie, ['id', 'title', 'poster_path', 'release_date'])
  );
  return { props: { writers } };
};

export default function TopWriters({
  writers,
}: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={writers} title="Top Writers" />;
}
