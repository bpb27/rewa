import { db } from '~/db/db';
import { pick } from 'remeda';
import { TopCategory } from '~/components/top-category';
import { StaticProps } from '~/types';

export const getStaticProps = () => {
  const directors = db.topCrew(
    35,
    'director',
    (crew) => pick(crew, ['id', 'name', 'profile_path']),
    (movie) => pick(movie, ['id', 'title', 'poster_path', 'release_date'])
  );
  return { props: { directors } };
};

export default function TopDirectors({
  directors,
}: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={directors} title="Top Directors" />;
}
